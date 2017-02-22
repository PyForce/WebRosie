import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ToggleField from 'material-ui/Toggle';
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
    this.props.saveSettings(this.state.settings);
    this.props.onRequestClose();
  }

  cancelDialog = () => {
    this.props.onRequestClose();
  }

  componentWillReceiveProps (nextProps) {
    this.setState({settings: nextProps.settings});
  }

  configure = (mode, option) => {
    this.setState({
      settings: {
        // destructure settings to have all the values
        ...this.state.settings,
        // change the values in the desired mode
        [mode]: {
          // destructure the mode values to prevent deleting
          ...this.state.settings[mode],
          // overwrite the generated values
          ...option
        }
      }
    });
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
                       value={settings.single.time}
                       onChange={(e, value) => this.configure('single', {time: parseFloat(value)})} />
            <ToggleField toggled={settings.single.planner}
                         label='Use planner for target reach'
                         onToggle={(e, checked) => this.configure('single', {planner: checked}) } />
          </Tab>
          <Tab label='path' icon={<PathIcon />}>
            <TextField floatingLabelText='Time interval between path points'
                       type='number' hintText='amount of seconds' fullWidth={true}
                       value={settings.path.delay}
                       onChange={(e, value) => this.configure('path', {delay: parseFloat(value)})} />
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
