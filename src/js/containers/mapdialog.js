import { connect } from 'react-redux';

import MapDialog from '../components/mapdialog';
import { ADD_ROBOT } from '../actions';


function mapStateToProps (state) {
  return {
    robots: state.robots
  };
}

const MapDialogProvider = connect(
  mapStateToProps
)(MapDialog);

export default MapDialogProvider;
