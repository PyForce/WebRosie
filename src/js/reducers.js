// state reducers for the store
import * as actions from './actions';


// handles the displayed robots
export function robots (state = [], action) {
  const { robot: obj } = action;
  switch (action.type) {
    // add a robot
  case actions.ADD_ROBOT:
    return [ ...state, { id: obj.name, robot: obj }];
    // remove a robot
  case actions.RM_ROBOT:
    return state.filter((elem) => elem.id !== action.id);
  default:
    return state;
  }
}


// handles the selected robot
export function robot (state = null, action) {
  switch (action.type) {
    // update selected robot index
  case actions.SELECT_ROBOT:
    return action.id;
  default:
    return state;
  }
}


// handles the loaded map
export function map (state = null, action) {
  switch (action.type) {
    // update the map
  case actions.UPDATE_MAP:
    return action.map;
  default:
    return state;
  }
}


// handles tha active modes
export function mode (state = { order: false, single: false, path: false, user: false }, action) {
  switch (action.type) {
    // set order mode
  case actions.ORDER_MODE:
    if (!action.value) {
      return { ...state, order: false };
    }

    return {
      order: true,
      single: false,
      path: false,
      user: false
    };
  case actions.SINGLE_MODE:
    if (!action.value) {
      return { ...state, single: false };
    }

    return {
      order: false,
      single: true,
      path: false,
      user: false
    };
    // set path mode
  case actions.PATH_MODE:
    if (!action.value) {
      return { ...state, path: false };
    }

    return {
      order: false,
      single: false,
      path: true,
      user: false
    };
    // set user mode
  case actions.USER_MODE:
    if (!action.value) {
      return { ...state, user: false };
    }

    return {
      order: false,
      single: false,
      path: false,
      user: true
    };
  case actions.SELECT_ROBOT:
    if (!action.id) {
      return { order: false, path: false, user: false };
    }
    return state;
  default:
    return state;
  }
}

const keyCodeToDirection = {
  87: [ 0, 1, 0 ],  // W
  83: [ 0, -1, 0 ],  // S
  68: [ 1, 0, 0 ],  // D
  65: [ -1, 0, 0 ],  // A
  69: [ 0, 0, 1 ],  // E
  81: [ 0, 0, -1 ]  // Q
};

// handles the pressed keys
export function direction (state = [ 0, 0, 0 ], action) {
  let dir;
  switch (action.type) {
  // wASD vector update
  case actions.PRESS_KEY:
    dir = keyCodeToDirection[action.key];
    return dir ? state.map((e, i) => Math.min(1, Math.max(-1, e + dir[i]))) : state;
  case actions.RELEASE_KEY:
    dir = keyCodeToDirection[action.key];
    return dir ? state.map((e, i) => Math.min(1, Math.max(-1, e - dir[i]))) : state;
  // joystick vector update
  case actions.JOYSTICK_MOVE:
    return [ action.movement.x, action.movement.y, state[2] ];
  // reset vector on mode change
  case actions.ORDER_MODE:
  case actions.PATH_MODE:
  case actions.USER_MODE:
    return [ 0, 0, 0 ];
  default:
    return state;
  }
}


// handles the movement of a robot
export function move (state = null, action) {
  switch (action.type) {
  case actions.MOVE_ROBOT:
    return {
      id: action.id,
      x: action.position.x,
      y: action.position.y,
      theta: action.position.theta
    };
  case actions.SELECT_ROBOT:
    return !action.id ? state : { id: action.id };
  default:
    return null;
  }
}


// handles application messages
export function report (state = null, action) {
  switch (action.type) {
  case actions.NOTIFY_REPORT:
    return {
      text: action.text,
      level: action.level
    };
  case actions.CLEAR_REPORT:
    return null;
  default:
    return state;
  }
}


// handles the path currently being edited
export function path (state = [], action) {
  switch (action.type) {
  case actions.ADD_POINT:
    return state.concat([ action.point ]);
  case actions.CLEAR_PATH:
    return [];
  default:
    return state;
  }
}


// handles the change of the settings
export function settings (state = {
  single: { time: 5, planner: false, smooth: false },
  path: { delay: 2, smooth: false },
  user: { joystick: 'touch' }}, action) {
  switch (action.type) {
  case actions.CONFIG_OPTION:
    return {
      ...state,
      ...action.option
    };
  default:
    return state;
  }
}
