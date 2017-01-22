import { connect } from 'react-redux'

import LMap from '../components/map'

var last = 0;
function mapStateToProps(state) {
  return {
    robot: state.robots.length > last ?
      state.robots[last++] : null
  }
}

const RosieMap = connect(
  mapStateToProps
)(LMap);

export default RosieMap;
