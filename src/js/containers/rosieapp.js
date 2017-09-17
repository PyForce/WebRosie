import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot, pressKey, releaseKey, updateMap, clearReport } from '../actions';


function mapStateToProps (state) {
  const selected = state.robot;
  const robotInfo = state.robots.find((r) => r.id === selected);

  return {
    mode: state.mode,
    joystickShow: state.settings.user.joystick,
    report: state.report || { text: '', level: 'info' },
    notification: Boolean(state.report),
    hasCamera: robotInfo ? Boolean(robotInfo.robot.video) : false
    selected: selected !== null,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    addRobot: (...params) => dispatch(addRobot(...params)),
    keyDown: (key) => dispatch(pressKey(key)),
    keyUp: (key) => dispatch(releaseKey(key)),
    loadMap: (map) => dispatch(updateMap(map)),
    handleClearReport: () => dispatch(clearReport())
  };
}

const RosieApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp);

export default RosieApp;
