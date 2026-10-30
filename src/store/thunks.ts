// Actions that talk to the robots.
import { Rosie, RosieError, type Metadata } from "../api/rosie";
import { connection, forget, remember } from "../robots";
import { moveJoystick, pressKey, releaseKey } from "./direction";
import type { AppThunk } from "./index";
import { clearPath, notifyReport, updateMap } from "./misc";
import { setMode, type ModeName } from "./mode";
import { addRobot as robotAdded, moveRobot, removeRobot } from "./robots";

export function addRobot(host: string, port: number): AppThunk<Promise<void>> {
  return async (dispatch) => {
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
    } catch {
      rosie.close();
      forget(id);
      dispatch(removeRobot(id));
      dispatch(notifyReport({ text: `Couldn't connect to ${id}`, level: "error" }));
    }
  };
}

export function robotGoto(x: number, y: number): AppThunk<Promise<void>> {
  return (dispatch, getState) => {
    const { time, planner } = getState().settings.single;
    return withSelected(dispatch, getState, (rosie) => rosie.goto([x, y, time], planner));
  };
}

export function robotFollow(): AppThunk<Promise<void>> {
  return (dispatch, getState) => {
    const { path, settings } = getState();
    return withSelected(dispatch, getState, (rosie) => rosie.follow(path, settings.path.delay));
  };
}

// user mode puts rosie under manual control; every other mode (on or off) back to automatic
export function changeMode(mode: ModeName, value: boolean): AppThunk<Promise<void>> {
  return (dispatch, getState) =>
    withSelected(dispatch, getState, async (rosie) => {
      await (mode === "user" && value ? rosie.manual() : rosie.auto());
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
