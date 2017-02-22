import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import SingleIcon from 'material-ui/svg-icons/image/adjust';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/content/send';
import { Tab, Tabs } from 'material-ui/Tabs';


export default class SettingsModal extends React.Component {
  state = {
    settings: {
      single: {},
      path: {},
      user: {},
      command: {},
    }
  }

  acceptDialog = () => {
    this.props.onRequestClose();
  }

  cancelDialog = () => {
    this.props.onRequestClose();
  }

  componentWillReceiveProps (nextProps) {
    this.setState({settings: nextProps.settings});
  }

  render () {
    const actions = [
      <FlatButton label="Cancel" onTouchTap={this.cancelDialog}
                  primary={true} keyboardFocused={true} />,
      <FlatButton label="Accept" onTouchTap={this.acceptDialog}
                  primary={true} />,
    ];
    let { settings: _, ...other } = this.props;
    let { settings } = this.state;

    return (
      <Dialog title="Rosie mode settings" modal={true} actions={actions}
              {...other}>
        <Tabs>
          <Tab label='single' icon={<SingleIcon />}>
            <TextField floatingLabelText='Time to reach the destination'
                       type='number' hintText='amount of seconds' fullWidth={true}
                       value={settings.single.time} />
          </Tab>
          <Tab label='path' icon={<PathIcon />}>
            <TextField floatingLabelText='Time interval between path points'
                       type='number' hintText='amount of seconds' fullWidth={true}
                       value={settings.path.delay} />
          </Tab>
          <Tab label='user' icon={<UserIcon />}>
          </Tab>
          <Tab label='command' icon={<CommandIcon />}>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}
