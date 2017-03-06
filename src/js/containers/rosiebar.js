import { connect } from 'react-redux';

import Bar from '../components/bar';
import { setUser, setSingle, setPath, setOrder } from '../actions';


function mapStateToProps (state) {
  return {
    selected: state.robot,
    user: state.mode.user,
    single: state.mode.single,
    path: state.mode.path,
    order: state.mode.order,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    userMode: (value) => dispatch(setUser(value)),
    singleMode: (value) => dispatch(setSingle(value)),
    pathMode: (value) => dispatch(setPath(value)),
    orderMode: (value) => dispatch(setOrder(value))
  };
}

const RosieAppBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar);

export default RosieAppBar;
