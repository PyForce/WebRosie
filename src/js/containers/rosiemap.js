import { connect } from 'react-redux';

import { selectRobot, moveRobot, notifyReport,
         removeRobot, ADD_ROBOT, robotGoto, setUser } from '../actions';
import LMap from '../components/map';


function mapStateToProps (state) {
  return {
    robot: state.lastaction === ADD_ROBOT && state.robots.length > 0 ?
      state.robots[state.robots.length - 1] : null,
    map: state.map,
    mode: state.mode,
    selected: state.robot
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
    modeOff: () => dispatch(setUser(false))
  };
}

const RosieMap = connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    withRef: true
  }
)(LMap);

export default RosieMap;
