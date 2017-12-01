import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export default class AddRobotDialog extends React.Component {
  static propTypes = {
    onRequestClose: PropTypes.func
  }

  state = {
    robotHost: '',
    robotPort: ''
  }

  handleAccept = () => {
    this.props.onRequestClose(true,
      this.state.robotHost,
      this.state.robotPort || 80
    );
  }

  handleCancel = () => {
    this.props.onRequestClose(false);
  }

  handleAddressChange = (e, value) => {
    this.setState({ robotHost: value });
  }

  handlePortChange = (e, value) => {
    this.setState({ robotPort: value });
  }

  render () {
    const actions = [
      <FlatButton key={0} label='Cancel' onTouchTap={this.handleCancel}
        primary
      />,
      <FlatButton disabled={!(this.state.robotHost && this.state.robotPort)} key={1} label='Accept'
        onTouchTap={this.handleAccept} primary
      />,
    ];

    return (
      <Dialog actions={actions} modal title='Robot information'
        {...this.props}>
        {'Type the address of the new robot'} <br />
        <TextField floatingLabelText='Robot host address'
          hintText='localhost, 10.0.0.1, my.robot.com'
          onChange={this.handleAddressChange}
          style={{ float: 'left', width: '70%' }} value={this.state.robotHost}
        />

        <TextField floatingLabelText='Rosie WebHUD port' hintText='5000, 8080'
          onChange={this.handlePortChange} style={{ float: 'left', width: '30%' }}
          type='number' value={this.state.robotPort}
        />
      </Dialog>
    );
  }
}
