import { connect } from 'react-redux';

import Bar from '../components/bar';


function mapStateToProps (state) {
  return {
    selected: state.robot
  };
}

const RosieAppBar = connect(
  mapStateToProps
)(Bar);

export default RosieAppBar;
