import { connect } from 'react-redux'

import Map from '../components/map'

var last = 0;
function mapStateToProps(state) {
  return {
    robot: state.robots.length > last ?
      state.robots[last++] : null
  }
}

const RosieMap = connect(
  mapStateToProps
)(Map);

export default RosieMap;
