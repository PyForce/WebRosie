import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot, pressKey, releaseKey, updateMap, clearReport } from '../actions';


function mapStateToProps (state) {
  return {
    mode: state.mode,
    joystickShow: state.settings.user.joystick,
    report: state.report || { text: '', level: 'info' },
    notification: Boolean(state.report)
    selected: state.robot !== -1
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addRobot: (...params) => dispatch(addRobot(...params)),
    keyDown: (key) => dispatch(pressKey(key)),
    keyUp: (key) => dispatch(releaseKey(key)),
    loadMap: (map) => dispatch(updateMap(map)),
    clearReport: () => dispatch(clearReport())
  };
}

const RosieApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp);

export default RosieApp;
