import { connect } from 'react-redux';

import { selectRobot, moveRobot, notifyMessage, removeRobot, ADD_ROBOT } from '../actions';
import LMap from '../components/map';


function mapStateToProps (state, ownProps) {
  let last;
  if (ownProps.robot) {
    last = ownProps.robot.id + 1;
  }
  else {
    last = 0;
  }

  return {
    robot: state.robots.length > last ?
      state.robots[last] : null,
    map: state.map !== ownProps.map ? state.map : null,
    mode: state.mode
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
    moveRobot: (id, pos) => dispatch(moveRobot(id, pos))
  };
}

const RosieMap = connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    withRef: true
  }
)(LMap);

export default RosieMap;
