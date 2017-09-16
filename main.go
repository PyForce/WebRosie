package main

import (
	"context"
	"log"
	"net/http"

	"github.com/grandcat/zeroconf"
)

func serviceDiscover(results <-chan *zeroconf.ServiceEntry) {
	for entry := range results {
		log.Println("Found rosie:", entry.Instance, entry.AddrIPv4[0].String(), entry.Port)
	}
}

func main() {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		log.Fatalln("Failed to initialize resolver", err)
	}

	entries := make(chan *zeroconf.ServiceEntry)
	go serviceDiscover(entries)

	ctx := context.Background()
	if err = resolver.Browse(ctx, "_rosieapi._tcp", "local", entries); err != nil {
		log.Fatalln("Failed to browse", err)
	}

	// serve webrosie page
	http.Handle("/", http.FileServer(http.Dir(".")))
	if err = http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalln("Failed to start HTTP server", err)
	}

	<-ctx.Done()
}
