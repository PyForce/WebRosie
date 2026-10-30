// Open connections to the robots, by robot id. They live outside the store: the store only
// holds plain data.
import type { Rosie } from "./api/rosie";

const connections = new Map<string, Rosie>();

export function connection(id: string): Rosie | undefined {
  return connections.get(id);
}

export function remember(id: string, rosie: Rosie): void {
  connections.get(id)?.close();
  connections.set(id, rosie);
}

export function forget(id: string): void {
  connections.get(id)?.close();
  connections.delete(id);
}
