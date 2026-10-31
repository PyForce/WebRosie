import L from "leaflet";
import { useEffect, useRef } from "react";

import { drawMap } from "../map/draw";
import { RobotMarker } from "../map/robotMarker";
import { useAppDispatch, useAppSelector } from "../store";
import { addPathPoint } from "../store/misc";
import { selectRobot } from "../store/robots";
import { changeMode, robotGoto } from "../store/thunks";
import { colors } from "../theme";

interface Props {
  onReady: (map: L.Map) => void;
}

export function RobotMap({ onReady }: Props) {
  const dispatch = useAppDispatch();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<{ drawing: L.LayerGroup | null; target: L.CircleMarker; path: L.Polyline; trail: L.Polyline } | null>(null);
  const markers = useRef(new Map<string, RobotMarker>());

  const robots = useAppSelector((state) => state.robots.list);
  const selected = useAppSelector((state) => state.robots.selected);
  const mode = useAppSelector((state) => state.mode);
  const world = useAppSelector((state) => state.map);
  const path = useAppSelector((state) => state.path);

  // the latest state, for Leaflet's event handlers
  const latest = useRef({ mode, selected });
  useEffect(() => {
    latest.current = { mode, selected };
  }, [mode, selected]);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    const leaflet = L.map(container.current, { crs: L.CRS.Simple, zoomAnimation: false, zoomControl: false }).setView([0, 0], 9);
    layers.current = {
      drawing: null,
      target: L.circleMarker([0, 0], { color: colors.accent }),
      path: L.polyline([], { color: colors.accent }).addTo(leaflet),
      trail: L.polyline([], { color: colors.trail }).addTo(leaflet),
    };
    leaflet.on("click", (event: L.LeafletMouseEvent) => {
      const { mode: current } = latest.current;
      const { lat: y, lng: x } = event.latlng;
      if (current.single) {
        dispatch(robotGoto(x, y));
        layers.current?.target.setLatLng(event.latlng).addTo(leaflet);
      } else if (current.path) {
        dispatch(addPathPoint([x, y]));
      } else {
        // back to planned movements, and deselect
        dispatch(changeMode("manual", false));
        dispatch(selectRobot(null));
      }
    });
    map.current = leaflet;
    onReady(leaflet);
    const robotMarkers = markers.current;
    return () => {
      robotMarkers.clear();
      leaflet.remove();
      map.current = null;
    };
  }, [dispatch, onReady]);

  // the house
  useEffect(() => {
    const leaflet = map.current;
    if (!leaflet || !layers.current || !world) {
      return;
    }
    layers.current.drawing?.remove();
    layers.current.drawing = drawMap(world).addTo(leaflet);
  }, [world]);

  // the robots
  useEffect(() => {
    const leaflet = map.current;
    if (!leaflet) {
      return;
    }
    for (const [id, marker] of markers.current) {
      if (!robots.some((robot) => robot.id === id)) {
        marker.remove();
        markers.current.delete(id);
      }
    }
    for (const robot of robots) {
      let marker = markers.current.get(robot.id);
      if (!marker) {
        const [length, width] = robot.size;
        marker = new RobotMarker(leaflet, robot.vector, width, length, () => dispatch(selectRobot(robot.id)));
        markers.current.set(robot.id, marker);
      }
      if (!robot.position) {
        continue;
      }
      if (!marker.placed) {
        // a robot that just arrived: show where it is
        marker.moveTo(robot.position);
        leaflet.panTo(marker.latlng);
        continue;
      }
      const moved = !marker.latlng.equals([robot.position.y, robot.position.x]);
      marker.moveTo(robot.position);
      if (robot.id === selected && moved) {
        if (!leaflet.getBounds().contains(marker.latlng)) {
          leaflet.panTo(marker.latlng);
        }
        if (latest.current.mode.path) {
          layers.current?.trail.addLatLng(marker.latlng);
        }
      }
    }
  }, [robots, selected, dispatch]);

  // a robot selected out of view comes into view
  useEffect(() => {
    const leaflet = map.current;
    const marker = selected ? markers.current.get(selected) : undefined;
    if (leaflet && marker?.placed && !leaflet.getBounds().contains(marker.latlng)) {
      leaflet.panTo(marker.latlng);
    }
  }, [selected]);

  // the path being drawn starts at the selected robot
  useEffect(() => {
    if (!layers.current) {
      return;
    }
    const robot = robots.find((candidate) => candidate.id === selected);
    if (path.length === 0 || !robot?.position) {
      layers.current.path.setLatLngs([]);
      layers.current.trail.setLatLngs([]);
      return;
    }
    const start: L.LatLngTuple = [robot.position.y, robot.position.x];
    layers.current.path.setLatLngs([start, ...path.map(([x, y]): L.LatLngTuple => [y, x])]);
    // only when the path changes, not when the robot moves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, selected]);

  // the target marker only shows in single point mode
  useEffect(() => {
    if (!mode.single) {
      layers.current?.target.remove();
    }
  }, [mode.single]);

  return <div className="map" ref={container} />;
}
