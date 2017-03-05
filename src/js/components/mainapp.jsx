import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import MapIcon from 'material-ui/svg-icons/maps/map';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraOpenIcon from 'material-ui/svg-icons/av/videocam';
import CameraCloseIcon from 'material-ui/svg-icons/av/videocam-off';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import ZoomOutIcon from 'material-ui/svg-icons/action/zoom-out';
import MobileDetect from 'mobile-detect';

import RosieMap from '../containers/rosiemap';
import RosieAppBar from '../containers/rosiebar';
import MapDialogProvider from '../containers/mapdialog';
import AddRobotDialog from './robotdialog';
import ReportSnackbar from './reportsnackbar';
import RosieSettings from '../containers/rosiesettings';
import RosieJoystick from '../containers/rosiejoystick';
import RosieWebCam from '../containers/rosiewebcam';
import { RosiePathAction } from '../containers/rosiemodes';
import { ORDER_MODE, USER_MODE } from '../actions';


export default class MainApp extends React.Component {
  state = {
    drawer: false,
    settings: false,
    robotdialog: false,
    mapdialog: false,
    zoomin: true,
    zoomout: true,
    notification: false,
    report: {
      text: '',
      level: 'info'
    },
    camera: false
  }

  componentWillMount () {
    window.addEventListener('load', () => {
      let map = this.refs.rosiemap.getWrappedInstance().map;
      // disable enable zoom buttons depending on zoom level
      map.on('zoomend zoomlevelschange', () => {
        let disabledOut = map._zoom <= map.getMinZoom();
        let disabledIn = map._zoom >= map.getMaxZoom();

        this.setState({ zoomin: !disabledIn, zoomout: !disabledOut });
      });
    });

    let md = new MobileDetect(window.navigator.userAgent);
    this.isTouch = md.phone() !== null || md.tablet() !== null;

    if (!this.isTouch && this.props.joystickShow !== 'always') {
      this.registerWASD();
    }
  }

  // joystick show condition
  showJoystick = () => this.isTouch || this.props.joystickShow === 'always' &&
      this.props.joystickShow !== 'none';

  componentWillReceiveProps (nextProps) {
    if (nextProps.joystickShow !== this.props.joystickShow) {
      this.registerWASD(nextProps.joystickShow !== 'always' && !this.isTouch);
    }
  }

  toggleDrawer = () => {
    this.setState({ drawer: !this.state.drawer });
  }

  acceptRobot = (accepted, ...data) => {
    if (accepted) {
      this.props.addRobot(...data);
    }

    // hide the robotdialog
    this.setState({ robotdialog: false });
  }

  acceptMap = (accepted, data) => {
    if (accepted) {
      this.props.loadMap(data);
    }

    // hide the robotdialog
    this.setState({ mapdialog: false });
  }

  _zoomIn = (e) => {
    let map = this.refs.rosiemap.getWrappedInstance().map;
    if (map._zoom >= map.getMaxZoom()) {
      return;
    }
    map.zoomIn(map.options.zoomDelta * (e.shiftKey ? 3 : 1));
  }

  _zoomOut = (e) => {
    let map = this.refs.rosiemap.getWrappedInstance().map;
    if (map._zoom <= map.getMinZoom()) {
      return;
    }
    map.zoomOut(map.options.zoomDelta * (e.shiftKey ? 3 : 1));
  }

  // register or unregister the keyboard events
  registerWASD = (active = true) => {
    if (active) {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      return;
    }

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (event) => {
    let store = this._reactInternalInstance._context.store;
    if (store.getState().mode.user) {
      this.props.keyDown(event.which);
    }
  }

  handleKeyUp = (event) => {
    let store = this._reactInternalInstance._context.store;
    if (store.getState().mode.user) {
      this.props.keyUp(event.which);
    }
  }

  toggleCamera = () => {
    this.setState({ camera: !this.state.camera });
  }

  render () {
    const zoombtns = {
      position: 'absolute',
      bottom: 0,
      margin: '0 0 1% 1%',
      zIndex: 1000
    };
    const zoombtn = {
      display: 'block'
    };
    const joystickContainer = {
      position: 'absolute',
      height: '25%',
      width: '25%',
      bottom: 0,
      right: 0
    };
    const actionsContainer = {
      ...zoombtns,
      margin: '0 1% 1% 0',
      bottom: '40%',
      right: 0
    };

    let camerabutton =
      <FloatingActionButton style={zoombtn}
                            onTouchTap={this.toggleCamera}
                            secondary={this.state.camera}>
        {this.state.camera ? <CameraCloseIcon /> : <CameraOpenIcon />}
      </FloatingActionButton>;

    return (
      <div>
        <AddRobotDialog open={this.state.robotdialog} onRequestClose={this.acceptRobot}
                        autoDetectWindowHeight={true} autoScrollBodyContent={true} />
        <MapDialogProvider open={this.state.mapdialog} onRequestClose={this.acceptMap}
                           autoDetectWindowHeight={true} autoScrollBodyContent={true} />
        <RosieSettings open={this.state.settings}
                       onRequestClose={() => this.setState({ settings: false })}
                       autoDetectWindowHeight={true} autoScrollBodyContent={true} />

        <Drawer open={this.state.drawer} docked={false}
                onRequestChange={(open) => this.setState({ drawer: open })}>
          <MenuItem primaryText="Add robot" leftIcon={<ContentAddIcon />}
            onTouchTap={() => this.setState({ robotdialog: true, drawer: false })} />
          <MenuItem primaryText="Select map" leftIcon={<MapIcon />}
            onTouchTap={() => this.setState({ mapdialog: true, drawer: false })} />
          <MenuItem primaryText="Settings" leftIcon={<SettingsIcon />}
            onTouchTap={() => this.setState({ settings: true, drawer: false })} />
        </Drawer>

        <div style={{ height: '100%' }} className='flex column wrap start'>
          <RosieAppBar onLeftIconButtonTouchTap={this.toggleDrawer} />
          <RosieMap ref='rosiemap' />

          {this.props.mode.user && this.showJoystick() ? <RosieJoystick style={joystickContainer} /> : undefined}
          {this.props.mode.path ? <RosiePathAction style={actionsContainer}/> : undefined}
          {this.state.camera ? <RosieWebCam /> : undefined}

          <div className="actions" style={zoombtns}>
            {this.props.selected && this.props.hasCamera ? camerabutton : undefined}
            <FloatingActionButton style={zoombtn}
                                  onTouchTap={this._zoomIn}
                                  disabled={!this.state.zoomin}>
              <ZoomInIcon />
            </FloatingActionButton>
            <FloatingActionButton style={zoombtn} onTouchTap={this._zoomOut}
                                  disabled={!this.state.zoomout}>
              <ZoomOutIcon />
            </FloatingActionButton>
          </div>
          <ReportSnackbar open={this.props.notification} message={this.props.report.text}
                    autoHideDuration={2000} level={this.props.report.level}
                    onRequestClose={this.props.clearReport} />
        </div>
      </div>
    );
  }
}
