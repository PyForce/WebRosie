import { connect } from 'react-redux';

import { robotFollow, clearPath } from '../actions';
import { PathActions } from '../components/modeactions';


function pathMapStateToProps (state) {
  return {
    path: state.path.length > 0
  };
}

function pathMapDispatchToProps (dispatch) {
  return {
    handleSendPath: () => dispatch(robotFollow()),
    handleModeOff: () => dispatch(clearPath())
  };
}

export const RosiePathAction = connect(
  pathMapStateToProps,
  pathMapDispatchToProps
)(PathActions);
