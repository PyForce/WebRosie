import { connect } from 'react-redux';

import { selectRobot, moveRobot, notifyReport,
         removeRobot, ADD_ROBOT, robotGoto, setUser,
         ADD_POINT, addPathPoint } from '../actions';
import LMap from '../components/map';


function lastActionItem (action, elems, state) {
  let n = elems.length - 1;
  return state.lastaction === action && n > -1 ? elems[n] : null;
}

function mapStateToProps (state) {
  return {
    robot: lastActionItem(ADD_ROBOT, state.robots, state),
    map: state.map,
    mode: state.mode,
    selected: state.robot,
    path: lastActionItem(ADD_POINT, state.path, state)
  };
}

function mapDispatchToProps (dispatch) {
  return {
    deselectRobot: () => {
      // select an invalid robot id to
      // deselect the currently selected
      dispatch(selectRobot(-1));
    },
    selectRobot: (id) => dispatch(selectRobot(id)),
    moveRobot: (id, pos) => dispatch(moveRobot(id, pos)),
    notify: (text, level) => dispatch(notifyReport(text, level)),
    removeRobot: (id) => dispatch(removeRobot(id)),
    robotGoto: (id, pos) => dispatch(robotGoto(id, pos)),
    modeOff: () => dispatch(setUser(false)),
    addPoint: (point) => dispatch(addPathPoint(point))
  };
}

const RosieMap = connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    withRef: true
  }
)(LMap);

export default RosieMap;
