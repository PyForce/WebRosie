import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot, pressKey, releaseKey, updateMap } from '../actions';


function mapStateToProps (state) {
  return {
    mode: state.mode
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addRobot: (...params) => dispatch(addRobot(...params)),
    keyDown: (key) => dispatch(pressKey(key)),
    keyUp: (key) => dispatch(releaseKey(key)),
    loadMap: (map) => dispatch(updateMap(map))
  };
}

const RosieApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp);

export default RosieApp;
