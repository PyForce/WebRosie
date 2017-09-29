/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ToggleField from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import SingleIcon from 'material-ui/svg-icons/image/adjust';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/content/send';
import { Tab, Tabs } from 'material-ui/Tabs';


class FloatField extends React.Component {
  isValid () {
    return this.field.isValid();
  }

  render () {
    return (
      <TextValidator errorMessages={[ 'time should be a floating point number',
        'the value should be positive', 'this field is required' ]}
        type='number' validators={[ 'isFloat', 'isPositive', 'required' ]}
        {...this.props} ref={(r) => this.field = r}
        style={{ marginBottom: '1em' }}
      />
    );
  }
}


class DummyForm extends React.Component {
  static propTypes = {
    children: PropTypes.array
  }
  // form that doesn't submit
  handleSubmit = () => null

  render () {
    return (
      <ValidatorForm onSubmit={this.handleSubmit} {...this.props} >
        {this.props.children}
      </ValidatorForm>
    );
  }
}


export default class SettingsModal extends React.Component {
  static propTypes = {
    saveSettings: PropTypes.func,
    onRequestClose: PropTypes.func,
    settings: PropTypes.shape({
      single: PropTypes.object,
      path: PropTypes.object,
      user: PropTypes.object,
      command: PropTypes.object
    })
  }

  state = {
    settings: {
      single: {},
      path: {},
      user: {},
      command: {},
    },
    valid: true
  }

  componentWillReceiveProps (nextProps) {
    // put the original values on the state
    this.setState({ settings: nextProps.settings });
  }

  handleAccept = () => {
    this.props.saveSettings(this.state.settings);
    this.props.onRequestClose();
  }

  handleCancel = () => {
    this.props.onRequestClose();
  }

  handleSettingChange = (mode, key, index = 1, update = null) => {
    return (...args) => this.configure(mode, { [key]: update ? update(args[index]) : args[index] });
  }

  configure = (mode, options) => {  // change a group of options inside a mode
    this.setState({
      settings: {
        // destructure settings to have all the values
        ...this.state.settings,
        // change the values in the desired mode
        [mode]: {
          // destructure the mode values to prevent deleting
          ...this.state.settings[mode],
          // overwrite the generated values
          ...options
        }
      }
    }, this.checkValid);
  }

  checkValid = () => {
    this.setState({ valid: this.time.isValid() && this.delay.isValid() });
  }

  render () {
    const { settings: _, ...other } = this.props; // eslint-disable-line no-unused-vars
    // the values are taken from the state to display edited values, not originals
    const { settings, valid } = this.state;
    const actions = [
      <FlatButton key={0} keyboardFocused label='Cancel' onTouchTap={this.handleCancel}
        primary
      />,
      <FlatButton disabled={!valid} key={1} label='Accept' onTouchTap={this.handleAccept}
        primary
      />,
    ];

    return (
      <Dialog actions={actions} modal title='Rosie mode settings' {...other}>
        <Tabs>
          <Tab icon={<SingleIcon />} label='single'>
            <DummyForm>
              {/* reach time*/}
              <FloatField floatingLabelText='Time to reach the destination' fullWidth
                hintText='amount of seconds' name='time'
                onChange={this.handleSettingChange('single', 'time', 1, parseFloat)}
                ref={(r) => this.time = r} value={settings.single.time}
              />
              {/* use planner?*/}
              <ToggleField label='Use planner for target reach'
                onToggle={this.handleSettingChange('single', 'planner')}
                toggled={settings.single.planner}
              />
              {/* interpolation*/}
              <SelectField disabled={!settings.single.planner}
                floatingLabelText='Type of interpolation to apply' fullWidth
                onChange={this.handleSettingChange('single', 'interpolation', 2)}
                value={settings.single.interpolation}>
                <MenuItem primaryText='Linear' value='Linear' />
                <MenuItem primaryText='Cubic' value='Cubic' />
              </SelectField>
              {/* smooth?*/}
              <ToggleField disabled={!settings.single.planner}
                label='Apply smooth to planner trajectories'
                onToggle={this.handleSettingChange('single', 'smooth')}
                toggled={settings.single.smooth}
              />
            </DummyForm>
          </Tab>
          <Tab icon={<PathIcon />} label='path'>
            <DummyForm>
              {/* interval time*/}
              <FloatField floatingLabelText='Time interval between path points' fullWidth
                hintText='amount of seconds' name='delay'
                onChange={this.handleSettingChange('path', 'delay', 1, parseFloat)}
                ref={(r) => this.delay = r}
                value={settings.path.delay}
              />
              {/* interpolation*/}
              <SelectField floatingLabelText='Type of interpolation to apply' fullWidth
                onChange={this.handleSettingChange('path', 'interpolation', 2)}
                value={settings.path.interpolation}>
                <MenuItem primaryText='Linear' value='linear' />
                <MenuItem primaryText='Cubic' value='cubic' />
              </SelectField>
              {/* smooth?*/}
              <ToggleField label='Apply smooth to planner trajectories'
                onToggle={this.handleSettingChange('path', 'smooth')}
                toggled={settings.path.smooth}
              />
            </DummyForm>
          </Tab>
          <Tab icon={<UserIcon />} label='user'>
            {/* nipple.js display: always, only for touch devices, none*/}
            <SelectField floatingLabelText='When to display the joystick' fullWidth
              onChange={this.handleSettingChange('user', 'joystick', 2)}
              value={settings.user.joystick}>
              <MenuItem primaryText='Always' value='always' />
              <MenuItem primaryText='Touch Device' value='touch'/>
              <MenuItem primaryText='Do not show' value='none' />
            </SelectField>
          </Tab>
          <Tab icon={<CommandIcon />} label='command' />
        </Tabs>
      </Dialog>
    );
  }
}
