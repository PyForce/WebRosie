// The rosie web API (rosie/apis/web): REST for orders, a WebSocket for positions and keys.

export interface Position {
  x: number; // m
  y: number; // m
  theta: number; // rad, counter-clockwise from the x axis
}

export interface Metadata {
  name: string;
  thumbnail: string; // path of the robot's picture
  vector: string; // path of the robot's icon
  video: string | false; // stream, ":port/path" meaning on the robot's host
  size: [number, number, number]; // length, width, height (m)
  profile: string;
}

export interface WorldMap {
  name: string;
  rooms: Record<string, Record<string, GeoJSON.GeoJsonObject | Record<string, GeoJSON.GeoJsonObject>>>;
}

// steer, throttle, rotation: each in [-1, 1]
export type Direction = [number, number, number];

export class RosieError extends Error {}

export class Rosie {
  readonly host: string;
  readonly port: number;
  private readonly socket: WebSocket;

  constructor(host: string, port: number, onPosition: (position: Position) => void) {
    this.host = host;
    this.port = port;
    this.socket = new WebSocket(`ws://${host}:${port}/websocket`);
    this.socket.onmessage = (message: MessageEvent<string>) => {
      const data = JSON.parse(message.data) as { type: string; data: Position };
      if (data.type === "position") {
        onPosition(data.data);
      }
    };
  }

  get address(): string {
    return `${this.host}:${this.port}`;
  }

  url(path: string): string {
    return `http://${this.address}${path}`;
  }

  close(): void {
    this.socket.close();
  }

  move(direction: Direction): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "move", data: direction }));
    }
  }

  odometry(): Promise<Position> {
    return this.get("/odometry");
  }

  metadata(): Promise<Metadata> {
    return this.get("/metadata");
  }

  maps(): Promise<{ maps: string[] }> {
    return this.get("/maps");
  }

  map(name: string): Promise<WorldMap> {
    return this.get(`/map/${encodeURIComponent(name)}`);
  }

  useMap(name: string): Promise<void> {
    return this.post(`/map/${encodeURIComponent(name)}`, null);
  }

  goto(target: [number, number, number], planner: boolean): Promise<void> {
    return this.post("/goto", { target, planner });
  }

  follow(path: [number, number][], time: number): Promise<void> {
    return this.post("/follow", { path, time });
  }

  manual(): Promise<void> {
    return this.post("/manual", null);
  }

  planned(): Promise<void> {
    return this.post("/planned", null);
  }

  private async get<T>(path: string): Promise<T> {
    return (await this.request(path, { method: "GET" })).json() as Promise<T>;
  }

  private async post(path: string, body: unknown): Promise<void> {
    await this.request(path, {
      method: "POST",
      headers: body === null ? {} : { "Content-Type": "application/json" },
      body: body === null ? null : JSON.stringify(body),
    });
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const response = await fetch(this.url(path), init);
    if (!response.ok) {
      throw new RosieError(await errorMessage(response));
    }
    return response;
  }
}

// rosie explains refusals as {"error": ...} (409) or {"detail": ...} (404, 422)
async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; detail?: unknown };
    const reason = body.error ?? body.detail;
    if (typeof reason === "string") {
      return reason;
    }
    if (Array.isArray(reason)) {
      return reason.map((item: { msg?: string }) => item.msg ?? "").join("; ");
    }
  } catch {
    // no JSON body
  }
  return `${response.status} ${response.statusText}`;
}
