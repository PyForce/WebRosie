// actions generators to use with store.dispatch(...)

export const ADD_ROBOT = 1;
export const RM_ROBOT = 2;
export const MOVE_ROBOT = 3;
export const SELECT_ROBOT = 4;
export const UPDATE_MAP = 5;
export const GOTO_ROBOT = 6;
export const ORDER_MODE = 7;
export const PATH_MODE = 8;
export const USER_MODE = 9;
export const COMMAND_ROBOT = 10;
export const PRESS_KEY = 11;
export const RELEASE_KEY = 12;
export const PATH_ROBOT = 13;


export function addRobot (host = document.domain, port = location.port, video = 8080) {
  return {
    type: ADD_ROBOT,
    params: [
      host,
      port,
      video
    ]
  };
}

export function removeRobot (id) {
  return { type: RM_ROBOT, id: id };
}

export function moveRobot (id, pos) {
  return { type: MOVE_ROBOT, id: id, position: pos };
}

export function selectRobot (id) {
  return { type: SELECT_ROBOT, id: id };
}

export function updateMap (map) {
  return { type: UPDATE_MAP, map: map };
}

export function robotGoto (id, pos) {
  return { type: GOTO_ROBOT, id: id, position: pos };
}

export function setOrder (value) {
  return { type: ORDER_MODE, value: value };
}

export function setPath (value) {
  return { type: PATH_MODE, value: value };
}

export function setUser (value) {
  return { type: USER_MODE, value: value };
}

export function robotCommand (command) {
  return { type: COMMAND_ROBOT, command: command };
}

export function pressKey (key) {
  return { type: PRESS_KEY, key: key };
}

export function releaseKey (key) {
  return { type: RELEASE_KEY, key: key };
}

export function robotPath (path, smooth = false, interpolation = 'linear', k = 0.1, time = 10) {
  return {
    type: PATH_ROBOT,
    path: {
      path: path,
      smooth: smooth,
      interpolation: interpolation,
      k: k,
      time: time
    }
  };
}
