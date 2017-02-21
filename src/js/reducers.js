// state reducers for the store
import * as actions from './actions';
import Robot from './robot';


// handles the displayed robots
export function robots (state = [], action) {
  switch (action.type) {
    // add a robot
  case actions.ADD_ROBOT:
    let last = state[state.length - 1];
    let id = last ? last.id + 1 : 0;
    return [
      ...state,
      {
        id: id,
        robot: new Robot(...action.params)
      }
    ];
    // remove a robot
  case actions.RM_ROBOT:
    return state.filter((elem) => elem.id !== action.id);
  default:
    return state;
  }
}


// handles the selected robot
export function robot (state = -1, action) {
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
    if (action.id < 0) {
      return { order: false, path: false, user: false };
    }
  default:
    return state;
  }
}

const keyCodeToDirection = {
  87: [0, 1, 0],  // W
  83: [0, -1, 0],  // S
  68: [1, 0, 0],  // D
  65: [-1, 0, 0],  // A
  69: [0, 0, 1],  // E
  81: [0, 0, -1]  // Q
};

// handles the pressed keys
export function direction (state = [0, 0, 0], action) {
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
    return [action.movement.x, action.movement.y, state[2]];
  // reset vector on mode change
  case actions.ORDER_MODE:
  case actions.PATH_MODE:
  case actions.USER_MODE:
    return [0, 0, 0];
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
  default:
    return null;
  }
}


// handles the path currently being edited
export function path (state = [], action) {
  switch (action.type) {
  case actions.ADD_POINT:
    return state.concat([action.point]);
  default:
    return state;
  }
}
