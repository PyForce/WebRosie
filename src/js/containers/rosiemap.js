import { connect } from 'react-redux'

import { selectRobot } from '../actions'
import LMap from '../components/map'


function mapStateToProps(state, ownProps) {
  let last;
  if (ownProps.robot)
    last = ownProps.robot.id + 1;
  else
    last = 0;

  return {
    robot: state.robots.length > last ?
      state.robots[last] : null,
    map: state.map !== ownProps.map ? state.map : null,
    mode: state.mode
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onDeselectRobot: () => {
      // select an invalid robot id to
      // deselect the currently selected
      dispatch(selectRobot(-1));
    }
  }
}

const RosieMap = connect(
  mapStateToProps
)(LMap);

export default RosieMap;
