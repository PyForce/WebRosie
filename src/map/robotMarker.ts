import L from "leaflet";

import type { Position } from "../api/rosie";

// The robot's icon on the map: its real size (it grows and shrinks with the zoom), turned to
// its heading. The marker places the icon; the image inside it is what turns.
export class RobotMarker {
  readonly marker: L.Marker;
  private readonly map: L.Map;
  private readonly image: HTMLImageElement;
  private readonly width: number; // m, across the robot
  private readonly length: number; // m, front to back
  private theta = 0;
  placed = false; // has had a position yet

  constructor(map: L.Map, url: string, width: number, length: number, onClick: () => void) {
    this.map = map;
    this.width = width;
    this.length = length;
    this.image = document.createElement("img");
    this.image.src = url;
    this.image.className = "robot-image";
    // fill the icon (Leaflet's stylesheet sizes marker images to their own proportions)
    this.image.style.width = "100%";
    this.image.style.height = "100%";
    this.marker = L.marker([0, 0], { icon: this.icon(), interactive: true, zIndexOffset: 1000 });
    this.marker.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      onClick();
    });
    this.marker.addTo(map);
    map.on("zoomend", this.resize);
  }

  get latlng(): L.LatLng {
    return this.marker.getLatLng();
  }

  moveTo(position: Position): void {
    this.placed = true;
    this.theta = position.theta;
    this.marker.setLatLng([position.y, position.x]);
    this.turn();
  }

  remove(): void {
    this.map.off("zoomend", this.resize);
    this.marker.remove();
  }

  private readonly resize = () => {
    this.marker.setIcon(this.icon());
    this.turn();
  };

  private icon(): L.DivIcon {
    // CRS.Simple: one map unit (1 m) is 2^zoom pixels
    const scale = 2 ** this.map.getZoom();
    const size: L.PointExpression = [this.width * scale, this.length * scale];
    return L.divIcon({ html: this.image, className: "robot-icon", iconSize: size, iconAnchor: [size[0] / 2, size[1] / 2] });
  }

  private turn(): void {
    // the page's y axis points down, so the map's counter-clockwise turns are clockwise in CSS
    this.image.style.transform = `rotate(${-this.theta}rad)`;
  }
}
