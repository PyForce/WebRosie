import L from "leaflet";

import type { WorldMap } from "../api/rosie";
import { colors } from "../theme";

const STYLES: Record<string, L.PathOptions> = {
  walls: { color: colors.text, weight: 5, opacity: 0.8 },
  doors: { color: colors.primary, weight: 10, opacity: 0.75 },
  items: { color: colors.accent, weight: 1, opacity: 0.75 },
};

// draws the rooms (shaded in turn), their walls, doors and items; returns the drawing
export function drawMap(world: WorldMap): L.LayerGroup {
  const layers = L.layerGroup();
  let shade = 0.25;
  for (const room of Object.values(world.rooms)) {
    for (const [element, value] of Object.entries(room)) {
      if (element === "borders") {
        const style = { color: colors.disabled, fillOpacity: shade, weight: 0 };
        L.geoJSON(value as GeoJSON.GeoJsonObject, { style }).addTo(layers);
        shade = shade + 0.25 > 0.8 ? 0.25 : shade + 0.25;
      } else if (element === "items") {
        for (const item of Object.values(value as Record<string, GeoJSON.GeoJsonObject>)) {
          L.geoJSON(item, { style: STYLES.items }).addTo(layers);
        }
      } else {
        L.geoJSON(value as GeoJSON.GeoJsonObject, { style: STYLES[element] }).addTo(layers);
      }
    }
  }
  return layers;
}
