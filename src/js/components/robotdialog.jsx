import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'


export default class AddRobotDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      robotHost: 'localhost',
      robotPort: 5000
    };

    this.acceptDialog = this.acceptDialog.bind(this);
    this.cancelDialog = this.cancelDialog.bind(this);
  }

  acceptDialog() {
    this.props.onRequestClose(true,
      this.state.robotHost,
      this.state.robotPort
    );
  }

  cancelDialog() {
    this.props.onRequestClose(false);
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" onTouchTap={this.cancelDialog}
                  primary={true} keyboardFocused={true} />,
      <FlatButton label="Accept" onTouchTap={this.acceptDialog}
                  primary={true}
                  disabled={!(this.state.robotHost && this.state.robotPort)} />,
    ];

    return (
      <Dialog title="Robot information" modal={true}
              actions={actions} {...this.props}>
        Type the address of the new robot <br />
        <TextField value={this.state.robotHost} floatingLabelText='Robot host address'
                   onChange={(e, val) => this.setState({ robotHost: val })}
                   hintText='localhost, 10.0.0.1, my.robot.com'
                   style={{float: 'left', width: '70%'}} />

        <TextField value={this.state.robotPort} floatingLabelText='Rosie WebHUD port'
                   onChange={(e, val) => this.setState({ robotPort: val })}
                   type='number' hintText='500, 5679'
                   style={{float: 'left', width: '30%'}} />
      </Dialog>
    );
  }
};
