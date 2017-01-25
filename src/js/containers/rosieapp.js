import { connect } from 'react-redux';

import MainApp from '../components/mainapp';
import { addRobot } from '../actions';


function mapDispatchToProps (dispatch) {
  return {
    onAddRobot: (...params) => {
      dispatch(addRobot(...params));
    }
  };
}

const RosieApp = connect(
  null,
  mapDispatchToProps
)(MainApp);

export default RosieApp;
