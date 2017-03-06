import { connect } from 'react-redux';

import WebCam from '../components/camera.jsx';


function mapStateToProps (state) {
  const robotInfo = state.robots.find((r) => r.id === state.robot);

  return {
    url: robotInfo ? robotInfo.robot.video : ''
  };
}


const RosieWebCam = connect(
  mapStateToProps
)(WebCam);

export default RosieWebCam;
