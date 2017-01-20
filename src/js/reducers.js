// state reducers for the store
import * as actions from './actions'
import Robot from './robot'


// handles the displayed robots
export function robots(state = [], action) {
  switch (action.type) {
    // add a robot
    case actions.ADD_ROBOT:
      let last = state[state.length - 1],
        id = last ? last.id + 1 : 0;
      return [
        ...state,
        {
          id: id,
          robot: new Robot(...action.params, id)
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
export function robot(state = null, action) {
  switch (action.type) {
    // update selected robot index
    case actions.SELECT_ROBOT:
      return action.id;
    default:
      return state;
  }
}


// handles the loaded map
export function map(state = null, action) {
  switch (action.type) {
    // update the map
    case actions.UPDATE_MAP:
      return action.map;
    default:
      return state;
  }
}


// handles tha active modes
export function mode(state = { order: false, path: false, user: false }, action) {
  switch (action.type) {
    // set order mode
    case actions.ORDER_MODE:
      if (!action.value)
        return { ...state, order: false };

      return {
        order: true,
        path: false,
        user: false
      };
    // set path mode
    case actions.PATH_MODE:
      if (!action.value)
        return { ...state, path: false };

      return {
        order: false,
        path: true,
        user: false
      };
    // set user mode
    case actions.USER_MODE:
      if (!action.value)
        return { ...state, user: false };

      return {
        order: false,
        path: false,
        user: true
      };
    default:
      return state;
  }
}


// handles the pressed keys
export function keys(state = [], action) {
  switch (action.type) {
    case actions.PRESS_KEY:
      return [ ...new Set(state.concat(action.key)) ];
    case actions.RELEASE_KEY:
      return state.filter((value) => value !== action.key);
    default:
      return state;
  }
}
