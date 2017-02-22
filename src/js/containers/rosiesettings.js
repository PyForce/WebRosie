import { connect } from 'react-redux';

import SettingsModal from '../components/settings';
import { configOption } from '../actions';


function mapStateToProps (state) {
  return {
    settings: state.settings
  };
}

function mapDispatchTopProps (dispatch) {
  return {
    saveSettings: (settings) => dispatch(configOption(settings))
  };
}

const RosieSettings = connect(
  mapStateToProps,
  mapDispatchTopProps
)(SettingsModal);

export default RosieSettings;
