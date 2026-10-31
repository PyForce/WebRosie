import L from "leaflet";

import type { MapFeatureProperties, WorldMap } from "../api/rosie";
import { colors } from "../theme";

const STYLES: Record<Exclude<MapFeatureProperties["kind"], "room">, L.PathOptions> = {
  wall: { color: colors.text, weight: 5, opacity: 0.8 },
  door: { color: colors.primary, weight: 10, opacity: 0.75 },
  obstacle: { color: colors.accent, weight: 1, opacity: 0.75 },
};

// the rooms take these shades in turn, so neighbours stand apart
const SHADES = [0.25, 0.5, 0.75];

// draws the rooms, their walls, doors and obstacles; returns the drawing
export function drawMap(world: WorldMap): L.LayerGroup {
  const rooms = world.features.filter((feature) => feature.properties.kind === "room");
  const layers = L.layerGroup();
  L.geoJSON(world, {
    style: (feature) => {
      const properties = feature?.properties as MapFeatureProperties;
      if (properties.kind === "room") {
        const shade = SHADES[rooms.indexOf(feature as (typeof rooms)[number]) % SHADES.length];
        return { color: colors.disabled, fillOpacity: shade, weight: 0 };
      }
      return STYLES[properties.kind];
    },
  }).addTo(layers);
  return layers;
}
