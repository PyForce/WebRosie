// actions generators to use with store.dispatch(...)
import Robot from './robot';

export const ADD_ROBOT = 1;
export const RM_ROBOT = 2;
export const MOVE_ROBOT = 3;
export const SELECT_ROBOT = 4;
export const UPDATE_MAP = 5;
// export const GOTO_ROBOT = 6;
export const ORDER_MODE = 7;
export const PATH_MODE = 8;
export const USER_MODE = 9;
export const COMMAND_ROBOT = 10;
export const PRESS_KEY = 11;
export const RELEASE_KEY = 12;
// export const PATH_ROBOT = 13;
export const NOTIFY_REPORT = 14;
export const JOYSTICK_MOVE = 15;
export const SINGLE_MODE = 16;
export const ADD_POINT = 17;
export const CLEAR_PATH = 18;
export const CLEAR_REPORT = 19;
export const CONFIG_OPTION = 20;


// gets the robot with the specified id
function getRobot (robots, id) {
  const [ robot ] = robots.filter((r) => r.id === id);
  return robot;
}


// helper function to get a robot with id = `id` an execute an action on it
function robotRequest (id, preaction, callback = Promise.resolve) {
  return (dispatch, getState) => {
    if (preaction) {
      dispatch(preaction);
    }

    const { robots, robot } = getState();
    // in case id isn't a valid value, use the selected robot
    const selected = getRobot(robots, id || robot);

    if (!selected) {
      // no robot with such id
      return Promise.resolve();
    }

    return callback(selected.robot, dispatch, getState);
  };
}


export function addRobot (host, port, name = '') {
  return (dispatch) => {
    const robot = new Robot(host, port, name);
    const data = { type: ADD_ROBOT, robot };

    // fill robot info before updating state
    return robot.metadata().then(info => {
      if (!name) {
        robot.name = info.name;
      }

      const { video } = info;
      if (video && video.startsWith(':')) {
        robot.video = `http://${robot.host}${video}`;
        return;
      }
      robot.video = video;

      dispatch(data);
    });
  };
}

export function removeRobot (id) {
  return { type: RM_ROBOT, id: id };
}

export function moveRobot (id, pos) {
  return { type: MOVE_ROBOT, id: id, position: pos };
}

export function selectRobot (id = null) {
  return { type: SELECT_ROBOT, id: id };
}

export function updateMap (map) {
  return { type: UPDATE_MAP, map: map };
}

export function robotGoto (x, y, id = null) {
  return robotRequest(id, false, (robot, dispatch, getState) => {
    const { settings } = getState();

    return robot.goto([ x, y, settings.single.time ], settings.single.planner)
        .catch((err) => dispatch(notifyReport(err.response.body.error, 'warning')));
  });
}

// pure action method
export function setOrderAction (value) {
  return {
    type: ORDER_MODE,
    value
  };
}

// async action for mode set (waits for the request to the robot to be completed)
export function setOrder (value) {
  // mode actions act only on the selected robot, so `null` is the id
  return robotRequest(null, false, (robot, dispatch) => {
    return robot.auto().then((response) => {
      dispatch(setOrderAction(value));
      dispatch(clearPath());

      return response;
    });
  });
}

export function setSingleAction (value) {
  return {
    type: SINGLE_MODE,
    value
  };
}

export function setSingle (value) {
  return robotRequest(null, false, (robot, dispatch) => {
    return robot.auto().then((response) => {
      dispatch(setSingleAction(value));
      dispatch(clearPath());

      return response;
    });
  });
}

export function setPathAction (value) {
  return {
    type: PATH_MODE,
    value
  };
}

export function setPath (value) {
  return robotRequest(null, false, (robot, dispatch) => {
    return robot.auto().then((response) => {
      dispatch(setPathAction(value));
      dispatch(clearPath());

      return response;
    });
  });
}

export function setUserAction (value) {
  return {
    type: USER_MODE,
    value
  };
}

export function setUser (value) {
  return robotRequest(null, false, (robot, dispatch) => {
    return (value ? robot.manual() : robot.auto())
      .then((response) => {
        dispatch(setUserAction(value));
        dispatch(clearPath());

        return response;
      });
  });
}

export function robotCommand (command) {
  // TODO: wait for rosex to be implemented
  return { type: COMMAND_ROBOT, command: command };
}

export function pressKeyAction (key) {
  return {
    type: PRESS_KEY,
    key
  };
}

export function pressKey (key) {
  return robotRequest(null, pressKeyAction(key), (robot, dispatch, getState) => {
    const { direction } = getState();
    return robot.move(direction);
  });
}

export function releaseKeyAction (key) {
  return {
    type: RELEASE_KEY,
    key
  };
}

export function releaseKey (key) {
  return robotRequest(null, releaseKeyAction(key), (robot, dispatch, getState) => {
    return robot.move(getState().direction);
  });
}

export function moveJoystickAction (movement) {
  return {
    type: JOYSTICK_MOVE,
    movement
  };
}

export function moveJoystick (movement) {
  return robotRequest(null, moveJoystickAction(movement), (robot, dispatch, getState) => {
    return robot.move(getState().direction);
  });
}

export function addPathPoint (point) {
  return { type: ADD_POINT, point };
}

export function clearPath () {
  return { type: CLEAR_PATH };
}

export function robotFollow (id = null) {
  return robotRequest(id, false, (robot, dispatch, getState) => {
    const { path, settings } = getState();
    return robot.follow({ path, time: settings.path.delay });
  });
}

export function notifyReport (text, level) {
  return { type: NOTIFY_REPORT, text, level };
}

export function clearReport () {
  return { type: CLEAR_REPORT };
}

export function configOption (option) {
  return { type: CONFIG_OPTION, option };
}
