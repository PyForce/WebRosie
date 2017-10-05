/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react-2';
import { FormsyToggle, FormsySelect, FormsyText } from 'formsy-mui';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import SingleIcon from 'material-ui/svg-icons/image/adjust';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/content/send';
import { Tab, Tabs } from 'material-ui/Tabs';

Formsy.addValidationRule('isGreaterThan',
  (values, value, number) => Number(value) > Number(number)
);

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
    singleModePlanner: false,
    isFormValid: true
  }

  componentWillReceiveProps (nextProps) {
    this.setState({singleModePlanner: nextProps.settings.single.planner});
  }

  handleAccept = () => {
    this.props.saveSettings(this.form.getModel());
    this.props.onRequestClose();
  }

  handleCancel = () => {
    this.props.onRequestClose();
  }

  setValid = () => {
    this.setState({isFormValid: true});
  }

  setInvalid = () => {
    this.setState({isFormValid: false});
  }

  formChange = (values) => {
    const {'single.planner': usePlanner} = values;
    if (usePlanner == this.state.singleModePlanner) {
      return;
    }

    this.setState({singleModePlanner: usePlanner});
  }

  render () {
    const { settings, ...other } = this.props;
    const {singleModePlanner, isFormValid} = this.state;
    const actions = [
      <FlatButton key={0} label='Cancel' onTouchTap={this.handleCancel}
        primary
      />,
      <FlatButton disabled={!isFormValid} key={1} label='Accept'
        primary type="submit" form="settingform"
      />,
    ];

    return (
      <Dialog actions={actions} modal title='Rosie mode settings' {...other}>
        <Formsy.Form onValid={this.setValid} onInvalid={this.setInvalid} ref={(r) => this.form = r}
          id="settingform" onValidSubmit={this.handleAccept} onChange={this.formChange}>
          <Tabs>
            <Tab icon={<SingleIcon />} label='single'>
              {/* reach time*/}
              <FormsyText floatingLabelText='Time to reach the destination' fullWidth
                hintText='amount of seconds' name='single.time'
                validations='isFloat,isGreaterThan:0' value={settings.single.time}
                validationErrors={{
                  isFloat: 'must be a valid float value',
                  isGreaterThan: 'must be greater than 0'
                }}
              />
              {/* use planner?*/}
              <FormsyToggle label='Use planner for target reach'
                name='single.planner' value={settings.single.planner}
              />
              {/* interpolation*/}
              <FormsySelect disabled={!singleModePlanner} name='single.interpolation'
                floatingLabelText='Type of interpolation to apply' fullWidth
                value={settings.single.interpolation}>
                <MenuItem primaryText='Linear' value='Linear' />
                <MenuItem primaryText='Cubic' value='Cubic' />
              </FormsySelect>
              {/* smooth?*/}
              <FormsyToggle disabled={!singleModePlanner} name='single.smooth'
                label='Apply smooth to planner trajectories' value={settings.single.smooth}
              />
            </Tab>
            <Tab icon={<PathIcon />} label='path'>
              {/* interval time*/}
              <FormsyText floatingLabelText='Time interval between path points' fullWidth
                hintText='amount of seconds' name='path.delay' validations='isFloat,isGreaterThan:0'
                value={settings.path.delay}
                validationErrors={{
                  isFloat: 'must be a valid float value',
                  isGreaterThan: 'must be greater than 0'
                }}
              />
              {/* interpolation*/}
              <FormsySelect floatingLabelText='Type of interpolation to apply' fullWidth
                name='path.interpolation' value={settings.path.interpolation}>
                <MenuItem primaryText='Linear' value='linear' />
                <MenuItem primaryText='Cubic' value='cubic' />
              </FormsySelect>
              {/* smooth?*/}
              <FormsyToggle label='Apply smooth to planner trajectories'
                name='path.smooth' value={settings.path.smooth}
              />
            </Tab>
            <Tab icon={<UserIcon />} label='user'>
              {/* nipple.js display: always, only for touch devices, none*/}
              <FormsySelect floatingLabelText='When to display the joystick' fullWidth
                name='user.joystick' value={settings.user.joystick}>
                <MenuItem primaryText='Always' value='always' />
                <MenuItem primaryText='Touch Device' value='touch'/>
                <MenuItem primaryText='Do not show' value='none' />
              </FormsySelect>
            </Tab>
            <Tab icon={<CommandIcon />} label='command' />
          </Tabs>
        </Formsy.Form>
      </Dialog>
    );
  }
}
