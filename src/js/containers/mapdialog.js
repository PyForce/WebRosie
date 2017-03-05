import { connect } from 'react-redux';

import MapDialog from '../components/mapdialog';


function mapStateToProps (state) {
  return {
    robots: state.robots
  };
}

const MapDialogProvider = connect(
  mapStateToProps
)(MapDialog);

export default MapDialogProvider;
