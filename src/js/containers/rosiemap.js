import { connect } from 'react-redux';

import { selectRobot, moveRobot, notifyReport,
         removeRobot, robotGoto, setUser, addPathPoint } from '../actions';
import LMap from '../components/map';


function mapStateToProps (state) {
  const robotLen = state.robots.length;

  return {
    robot: robotLen > 0 ? state.robots[robotLen - 1] : null,
    map: state.map,
    mode: state.mode,
    selected: state.robot,
    path: state.path,
    move: state.move,
    pathClear: state.path.length === 0
  };
}

function mapDispatchToProps (dispatch) {
  return {
    deselectRobot: () => {
      // select an invalid robot id to
      // deselect the currently selected
      dispatch(selectRobot(null));
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
