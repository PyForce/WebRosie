import { connect } from 'react-redux';

import TouchJoystick from '../components/joystick';
import { moveJoystick } from '../actions';


function mapDispatchToProps (dispatch) {
  return {
    moveJoystick: (movement) => dispatch(moveJoystick(movement))
  };
}

const RosieJoystick = connect(
  null,
  mapDispatchToProps
)(TouchJoystick);

export default RosieJoystick;
