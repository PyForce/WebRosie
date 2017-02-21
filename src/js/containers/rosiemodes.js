import { connect } from 'react-redux';

import { robotFollow, clearPath } from '../actions';
import { PathActions } from '../components/modeactions';


function pathMapStateToProps (state) {
  return {
    path: state.path.path.length > 0
  };
}

function pathMapDispatchToProps (dispatch) {
  return {
    sendPath: () => dispatch(robotFollow()),
    modeOff: () => dispatch(clearPath())
  };
}

export const RosiePathAction = connect(
  pathMapStateToProps,
  pathMapDispatchToProps
)(PathActions);
