import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot, pressKey, releaseKey, updateMap, clearReport } from '../actions';


function mapStateToProps (state) {
  let selected = state.robot;
  let robotInfo = state.robots.find((r) => r.id === selected);

  return {
    mode: state.mode,
    joystickShow: state.settings.user.joystick,
    report: state.report || { text: '', level: 'info' },
    notification: Boolean(state.report),
    selected: selected !== -1,
    hasCamera: robotInfo ? Boolean(robotInfo.robot.video) : false
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
