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
export function mode (state = { order: false, path: false, user: false }, action) {
  switch (action.type) {
    // set order mode
  case actions.ORDER_MODE:
    if (!action.value) {
      return { ...state, order: false };
    }

    return {
      order: true,
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


// handles the pressed keys
export function keys (state = [], action) {
  switch (action.type) {
  case actions.PRESS_KEY:
    return [ ...new Set(state.concat(action.key)) ];
  case actions.RELEASE_KEY:
    return state.filter((value) => value !== action.key);
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


// handles the last action type
export function lastaction (state = null, action) {
  return action.type;
}
