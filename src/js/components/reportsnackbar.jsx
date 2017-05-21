import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { red800, yellow800 } from 'material-ui/styles/colors';


export default class ReportSnackBar extends React.Component {
  static propTypes = {
    level: React.PropTypes.oneOf([ 'error', 'warning', 'info' ])
  }

  render () {
    const { level, ...other } = this.props;
    const style = {
      backgroundColor: level === 'error' ? red800 : yellow800
    };

    return (
      <Snackbar {...other} bodyStyle={level !== 'info' ? style : null} />
    );
  }
}
