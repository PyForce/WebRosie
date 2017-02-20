import { connect } from 'react-redux';

import WebCam from '../components/camera.jsx';


function mapStateToProps (state) {
  return {
    url: ''
  };
}


const RosieWebCam = connect(
  mapStateToProps
)(WebCam);

export default RosieWebCam;
