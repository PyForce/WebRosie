import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot, pressKey, releaseKey } from '../actions';


function mapDispatchToProps (dispatch) {
  return {
    onAddRobot: (...params) => {
      dispatch(addRobot(...params));
    },
    keyDown: (key) => dispatch(pressKey(key)),
    keyUp: (key) => dispatch(releaseKey(key))
  };
}

const RosieApp = connect(
  null,
  mapDispatchToProps
)(MainApp);

export default RosieApp;
