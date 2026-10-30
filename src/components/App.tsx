import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Divider, Drawer, Fab, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type L from "leaflet";
import { useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store";
import { selectRobot } from "../store/robots";
import { addRobot, addServingRobot, keyDown, keyUp, loadMap } from "../store/thunks";
import { Camera } from "./Camera";
import { Joystick } from "./Joystick";
import { MapDialog } from "./MapDialog";
import { PathActions } from "./PathActions";
import { Report } from "./Report";
import { RobotDialog } from "./RobotDialog";
import { RobotMap } from "./RobotMap";
import { SettingsDialog } from "./SettingsDialog";
import { TopBar } from "./TopBar";

type Dialog = "robot" | "map" | "settings" | null;

// phones and tablets: a finger, not a mouse
const TOUCH = window.matchMedia("(pointer: coarse)").matches;

export function App() {
  const dispatch = useAppDispatch();
  const robots = useAppSelector((state) => state.robots.list);
  const selected = useAppSelector((state) => state.robots.list.find((robot) => robot.id === state.robots.selected));
  const mode = useAppSelector((state) => state.mode);
  const joystickSetting = useAppSelector((state) => state.settings.user.joystick);

  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [camera, setCamera] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [zoom, setZoom] = useState({ in: true, out: true });

  const showJoystick = joystickSetting !== "none" && (TOUCH || joystickSetting === "always");

  useEffect(() => {
    void dispatch(addServingRobot());
  }, [dispatch]);

  // the keyboard drives in user mode, unless the joystick does
  useEffect(() => {
    if (TOUCH || joystickSetting === "always" || !mode.user) {
      return;
    }
    const down = (event: KeyboardEvent) => !event.repeat && dispatch(keyDown(event.code));
    const up = (event: KeyboardEvent) => dispatch(keyUp(event.code));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [dispatch, joystickSetting, mode.user]);

  const onMapReady = useCallback((leaflet: L.Map) => {
    const update = () => setZoom({ in: leaflet.getZoom() < leaflet.getMaxZoom(), out: leaflet.getZoom() > leaflet.getMinZoom() });
    leaflet.on("zoomend zoomlevelschange", update);
    setMap(leaflet);
  }, []);

  const zoomBy = (direction: 1 | -1) => (event: React.MouseEvent) => {
    map?.setZoom(map.getZoom() + direction * (map.options.zoomDelta ?? 1) * (event.shiftKey ? 3 : 1));
  };

  const open = (which: Dialog) => () => {
    setDrawer(false);
    setDialog(which);
  };

  return (
    <div className="app">
      <RobotDialog
        open={dialog === "robot"}
        onClose={(robot) => {
          setDialog(null);
          if (robot) {
            void dispatch(addRobot(robot.host, robot.port));
          }
        }}
      />
      <MapDialog
        open={dialog === "map"}
        onClose={(choice) => {
          setDialog(null);
          if (choice) {
            void dispatch(loadMap(choice.address, choice.name));
          }
        }}
      />
      <SettingsDialog open={dialog === "settings"} onClose={() => setDialog(null)} />

      <Drawer open={drawer} onClose={() => setDrawer(false)} slotProps={{ paper: { sx: { width: 256 } } }}>
        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {robots.map((robot) => (
            <ListItemButton
              key={robot.id}
              onClick={() => {
                dispatch(selectRobot(robot.id));
                setDrawer(false);
              }}
            >
              <ListItemText primary={robot.name} secondary={robot.id} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={open("robot")}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary="Add robot" />
          </ListItemButton>
          <ListItemButton onClick={open("map")}>
            <ListItemIcon><MapIcon /></ListItemIcon>
            <ListItemText primary="Select map" />
          </ListItemButton>
          <ListItemButton onClick={open("settings")}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Drawer>

      <TopBar onMenu={() => setDrawer(!drawer)} />
      <RobotMap onReady={onMapReady} />

      {mode.user && showJoystick && <Joystick />}
      {mode.path && <PathActions />}
      {camera && selected?.video && <Camera url={selected.video} />}

      <div className="actions zoom-actions">
        {selected?.video && (
          <Fab color={camera ? "secondary" : "primary"} aria-label="Camera" onClick={() => setCamera(!camera)}>
            {camera ? <VideocamOffIcon /> : <VideocamIcon />}
          </Fab>
        )}
        <Fab color="primary" aria-label="Zoom in" disabled={!zoom.in} onClick={zoomBy(1)}>
          <ZoomInIcon />
        </Fab>
        <Fab color="primary" aria-label="Zoom out" disabled={!zoom.out} onClick={zoomBy(-1)}>
          <ZoomOutIcon />
        </Fab>
      </div>
      <Report />
    </div>
  );
}
