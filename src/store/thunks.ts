// Actions that talk to the robots.
import { Rosie, RosieError, type Metadata } from "../api/rosie";
import { connection, forget, remember } from "../robots";
import { moveJoystick, pressKey, releaseKey } from "./direction";
import type { AppThunk } from "./index";
import { clearPath, notifyReport, updateMap } from "./misc";
import { setMode, type ModeName } from "./mode";
import { addRobot as robotAdded, moveRobot, removeRobot } from "./robots";

export function addRobot(host: string, port: number): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const id = `${host}:${port}`;
    const rosie = new Rosie(host, port, (position) => dispatch(moveRobot({ id, position })));
    try {
      const info = await rosie.metadata();
      remember(id, rosie);
      dispatch(
        robotAdded({
          id,
          name: info.name,
          host,
          port,
          video: videoUrl(host, info.video),
          vector: rosie.url(info.vector),
          size: info.size,
          position: null,
        }),
      );
      dispatch(moveRobot({ id, position: await rosie.odometry() }));
      // with no map on screen yet, show the one this robot plans on
      const map = getState().map ? null : await rosie.currentMap().catch(() => null);
      if (map) {
        dispatch(updateMap(map));
      }
    } catch {
      rosie.close();
      forget(id);
      dispatch(removeRobot(id));
      dispatch(notifyReport({ text: `Couldn't connect to ${id}`, level: "error" }));
    }
  };
}

// A page served by a rosie (its Docker image) starts with that robot.
export function addServingRobot(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const { hostname, port, protocol } = window.location;
    const id = `${hostname}:${Number(port) || 80}`;
    if (protocol !== "http:" || getState().robots.list.some((robot) => robot.id === id)) {
      return;
    }
    const response = await fetch("/metadata").catch(() => null);
    // a page served by anything else answers 404, or index.html
    if (!response?.ok || !response.headers.get("content-type")?.includes("application/json")) {
      return;
    }
    await dispatch(addRobot(hostname, Number(port) || 80));
  };
}

export function robotGoto(x: number, y: number): AppThunk<Promise<void>> {
  return (dispatch, getState) => {
    const { speed, planner } = getState().settings.single;
    return withSelected(dispatch, getState, (rosie) => rosie.goto([x, y], speed, planner));
  };
}

export function robotFollow(): AppThunk<Promise<void>> {
  return (dispatch, getState) => {
    const { path, settings } = getState();
    const { speed, planner } = settings.path;
    return withSelected(dispatch, getState, (rosie) => rosie.follow(path, speed, planner));
  };
}

// manual mode puts rosie under manual control; every other mode (on or off) back to planned movements
export function changeMode(mode: ModeName, value: boolean): AppThunk<Promise<void>> {
  return (dispatch, getState) =>
    withSelected(dispatch, getState, async (rosie) => {
      await (mode === "manual" && value ? rosie.manual() : rosie.planned());
      dispatch(setMode({ mode, value }));
      dispatch(clearPath());
    });
}

export function keyDown(code: string): AppThunk {
  return (dispatch, getState) => {
    dispatch(pressKey(code));
    sendDirection(getState);
  };
}

export function keyUp(code: string): AppThunk {
  return (dispatch, getState) => {
    dispatch(releaseKey(code));
    sendDirection(getState);
  };
}

export function joystick(x: number, y: number): AppThunk {
  return (dispatch, getState) => {
    dispatch(moveJoystick({ x, y }));
    sendDirection(getState);
  };
}

// show a robot's map, and plan that robot's routes on it
export function loadMap(robotId: string, name: string): AppThunk<Promise<void>> {
  return async (dispatch) => {
    const rosie = connection(robotId);
    if (!rosie) {
      return;
    }
    try {
      const map = await rosie.map(name);
      await rosie.useMap(name);
      dispatch(updateMap(map));
    } catch (error) {
      report(dispatch, error);
    }
  };
}

// plan the selected robot's next movements with this trajectory planner
export function chooseTrajectoryPlanner(name: string): AppThunk<Promise<void>> {
  return (dispatch, getState) => withSelected(dispatch, getState, (rosie) => rosie.useTrajectoryPlanner(name));
}

function sendDirection(getState: () => { robots: { selected: string | null }; direction: [number, number, number] }) {
  const { robots, direction } = getState();
  if (robots.selected) {
    connection(robots.selected)?.move(direction);
  }
}

async function withSelected(
  dispatch: Parameters<AppThunk>[0],
  getState: Parameters<AppThunk>[1],
  order: (rosie: Rosie) => Promise<void>,
): Promise<void> {
  const selected = getState().robots.selected;
  const rosie = selected ? connection(selected) : undefined;
  if (!rosie) {
    return;
  }
  try {
    await order(rosie);
  } catch (error) {
    report(dispatch, error);
  }
}

function report(dispatch: Parameters<AppThunk>[0], error: unknown) {
  const text = error instanceof RosieError ? error.message : "The robot doesn't answer";
  dispatch(notifyReport({ text, level: "warning" }));
}

// ":8080/stream" means a port on the robot's host
function videoUrl(host: string, video: Metadata["video"]): string | null {
  if (!video) {
    return null;
  }
  return video.startsWith(":") ? `http://${host}${video}` : video;
}
