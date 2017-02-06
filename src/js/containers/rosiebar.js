import { connect } from 'react-redux';

import Bar from '../components/bar';
import { setUser, setPath, setOrder } from '../actions';


function mapStateToProps (state) {
  return {
    selected: state.robot,
    user: state.mode.user,
    path: state.mode.path,
    order: state.mode.order,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    setUserMode: (value) => dispatch(setUser(value)),
    setPathMode: (value) => dispatch(setPath(value)),
    setOrderMode: (value) => dispatch(setOrder(value))
  };
}

const RosieAppBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar);

export default RosieAppBar;
