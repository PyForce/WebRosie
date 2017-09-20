package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/grandcat/zeroconf"
)

type message struct {
	Name string `json:"name"`
	Host string `json:"host"`
	Port int    `json:"port"`
}

var (
	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan *message)
	upgrader  = websocket.Upgrader{}
	oldmsgs   []*message
)

func handleRosieDiscover(results <-chan *zeroconf.ServiceEntry) {
	for entry := range results {
		log.Println("Found rosie:", entry.Instance, entry.AddrIPv4[0].String(), entry.Port)

		msg := new(message)
		msg.Name = entry.Instance
		msg.Host = entry.AddrIPv4[0].String()
		msg.Port = entry.Port

		broadcast <- msg
		oldmsgs = append(oldmsgs, msg)
	}
}

func handleWSConnection(w http.ResponseWriter, r *http.Request) {
	// Upgrade GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalln("Failed to upgrade:", err)
	}

	log.Println("Connected client:", ws.RemoteAddr().String())
	clients[ws] = true

	// send all the clients all the already know hosts
	for ws := range clients {
		for _, msg := range oldmsgs {
			sendMessage(msg, ws)
		}
	}
}

func sendMessage(msg *message, ws *websocket.Conn) {
	if err := ws.WriteJSON(msg); err != nil {
		log.Println("Failed to send:", err)
		defer ws.Close()
		delete(clients, ws)
	}
}

func broadcastInfo() {
	for {
		msg := <-broadcast
		for ws := range clients {
			sendMessage(msg, ws)
		}
	}
}

func main() {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		log.Fatalln("Failed to initialize resolver", err)
	}

	entries := make(chan *zeroconf.ServiceEntry)
	go handleRosieDiscover(entries)

	go broadcastInfo()

	ctx := context.Background()
	if err = resolver.Browse(ctx, "_rosieapi._tcp", "local", entries); err != nil {
		log.Fatalln("Failed to browse", err)
	}

	// serve webrosie page
	http.Handle("/", http.FileServer(http.Dir("public")))
	// add websocket route
	http.HandleFunc("/ws", handleWSConnection)
	if err = http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalln("Failed to start HTTP server", err)
	}

	<-ctx.Done()
}
