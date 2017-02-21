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
export const NOTIFY_REPORT = 14;
export const JOYSTICK_MOVE = 15;
export const SINGLE_MODE = 16;
export const ADD_POINT = 17;
export const CLEAR_PATH = 18;


function getRobot (robots, id) {
  let [robot] = robots.filter((r) => r.id === id);
  return robot;
}


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

export function selectRobot (id = -1) {
  return { type: SELECT_ROBOT, id: id };
}

export function updateMap (map) {
  return { type: UPDATE_MAP, map: map };
}

export function robotGoto (id, pos) {
  return (dispatch, getState) => {
    let { robots } = getState();
    let selected = getRobot(robots, id);

    if (!selected) {
      // no robot with such id
      return Promise.resolve();
    }

    return selected.robot.goto(pos);
  };
}


function autoMode (action, value, quick = true, callback = () => null) {
  if (!value && quick) {
    // set to false, don't need to switch robot state
    return action;
  }

  return (dispatch, getState) => {
    let { robots, robot } = getState();
    let selected = getRobot(robots, robot);

    if (!selected) {
      // no robot with such id
      return Promise.resolve();
    }

    return selected.robot
      .auto()
      .then(() => {
        dispatch(action);
        callback(dispatch);
      });
  };
}


export function setOrder (value) {
  return autoMode({
    type: ORDER_MODE,
    value: value
  },
  value,
  true,
  (dispatch) => {
    dispatch(clearPath());
  });
}

export function setSingle (value) {
  return autoMode({
    type: SINGLE_MODE,
    value: value
  }, value, true,
  (dispath) => dispath(clearPath())
  );
}

export function setPath (value) {
  return autoMode({
    type: PATH_MODE,
    value: value
  },
  value,
  false,
  (dispatch) => {
    dispatch(clearPath());
  });
}

export function setUser (value) {
  return (dispatch, getState) => {
    let { robots, robot } = getState();
    let selected = getRobot(robots, robot);

    if (!selected) {
      // no robot with such id
      return Promise.resolve();
    }

    return (value ? selected.robot.manual() : selected.robot.auto())
      .then(() => {
        dispatch({ type: USER_MODE, value: value });
        dispatch(clearPath());
      });
  };
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

export function moveJoystick (movement) {
  return { type: JOYSTICK_MOVE, movement };
}

export function addPathPoint (point) {
  return {type: ADD_POINT, point};
}

export function clearPath () {
  return {type: CLEAR_PATH};
}

export function robotFollow () {
  return (dispatch, getState) => {
    let { robots, robot, path } = getState();
    let selected = getRobot(robots, robot);

    if (!selected) {
      return Promise.resolve();
    }

    return selected.robot.follow(path);
  };
}

export function notifyReport (text, level) {
  return { type: NOTIFY_REPORT, text, level };
}
