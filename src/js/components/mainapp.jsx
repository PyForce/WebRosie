import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import MapIcon from 'material-ui/svg-icons/maps/map';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import CameraOpenIcon from 'material-ui/svg-icons/av/videocam';
import CameraCloseIcon from 'material-ui/svg-icons/av/videocam-off';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import ZoomOutIcon from 'material-ui/svg-icons/action/zoom-out';
import { List, ListItem } from 'material-ui/List';
import MobileDetect from 'mobile-detect';

import RosieMap from '../containers/rosiemap';
import RosieAppBar from '../containers/rosiebar';
import MapDialogProvider from '../containers/mapdialog';
import AddRobotDialog from './robotdialog';
import ReportSnackbar from './reportsnackbar';
import RosieSettings from '../containers/rosiesettings';
import RosieJoystick from '../containers/rosiejoystick';
import RosieWebCam from '../containers/rosiewebcam';
import RosiePathAction from '../containers/rosiemodes';


export default class MainApp extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }

  static propTypes = {
    joystickShow: PropTypes.oneOf(['always', 'touch', 'none']),
    addRobot: PropTypes.func,
    loadMap: PropTypes.func,
    keyDown: PropTypes.func,
    keyUp: PropTypes.func,
    selectRobot: PropTypes.func,
    robots: PropTypes.array,
    mode: PropTypes.shape({
      single: PropTypes.bool,
      path: PropTypes.bool,
      user: PropTypes.bool,
      order: PropTypes.bool
    }),
    selected: PropTypes.bool,
    hasCamera: PropTypes.bool,
    report: PropTypes.shape({
      text: PropTypes.string,
      level: PropTypes.string
    }),
    notification: PropTypes.bool,
    handleClearReport: PropTypes.func
  }

  styles = {
    zoombtns: {
      position: 'absolute',
      bottom: 0,
      margin: '0 0 1% 1%',
      zIndex: 1000
    },
    zoombtn: {
      display: 'block'
    },
    joystickContainer: {
      position: 'absolute',
      height: '25%',
      width: '25%',
      bottom: 0,
      right: 0
    },
    actionsContainer: {
      position: 'absolute',
      zIndex: 1000,
      margin: '0 1% 1% 0',
      bottom: '40%',
      right: 0
    },
    appContainer: {
      height: '100%',
      width: '100%',
      position: 'absolute'
    }
  }

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
      const map = this.rosiemap.getWrappedInstance().map;
      // disable enable zoom buttons depending on zoom level
      map.on('zoomend zoomlevelschange', () => {
        const disabledOut = map._zoom <= map.getMinZoom();
        const disabledIn = map._zoom >= map.getMaxZoom();

        this.setState({ zoomin: !disabledIn, zoomout: !disabledOut });
      });
    });

    const md = new MobileDetect(window.navigator.userAgent);
    this.isTouch = md.phone() !== null || md.tablet() !== null;

    if (!this.isTouch && this.props.joystickShow !== 'always') {
      this.registerWASD();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.joystickShow !== this.props.joystickShow) {
      this.registerWASD(nextProps.joystickShow !== 'always' && !this.isTouch);
    }
  }

  // joystick show condition
  showJoystick = () => this.isTouch || this.props.joystickShow === 'always' &&
      this.props.joystickShow !== 'none';

  handleToggleDrawer = () => {
    this.setState({ drawer: !this.state.drawer });
  }

  handleCloseRobotDialog = (accepted, ...data) => {
    if (accepted) {
      this.props.addRobot(...data);
    }

    // hide the robotdialog
    this.setState({ robotdialog: false });
  }

  handleCloseMapDialog = (accepted, data) => {
    if (accepted) {
      this.props.loadMap(data);
    }

    // hide the robotdialog
    this.setState({ mapdialog: false });
  }

  handleCloseSettings = () => {
    this.setState({ settings: false });
  }

  handleChangeDrawer = (open) => {
    this.setState({ drawer: open });
  }

  handleAddRobot = () => {
    this.setState({ robotdialog: true, drawer: false });
  }

  handleChangeMap = () => {
    this.setState({ mapdialog: true, drawer: false });
  }

  handleChangeSettings = () => {
    this.setState({ settings: true, drawer: false });
  }

  _handleZoomIn = (e) => {
    const map = this.rosiemap.getWrappedInstance().map;
    if (map._zoom >= map.getMaxZoom()) {
      return;
    }
    map.zoomIn(map.options.zoomDelta * (e.shiftKey ? 3 : 1));
  }

  _handleZoomOut = (e) => {
    const map = this.rosiemap.getWrappedInstance().map;
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
    const store = this.context.store;
    if (store.getState().mode.user) {
      this.props.keyDown(event.which);
    }
  }

  handleKeyUp = (event) => {
    const store = this.context.store;
    if (store.getState().mode.user) {
      this.props.keyUp(event.which);
    }
  }

  handleToggleCamera = () => {
    this.setState({ camera: !this.state.camera });
  }

  handleRobotListClick = (id) => () => {
    this.props.selectRobot(id);
    this.setState({ drawer: false });
  }

  render () {
    const camerabutton = (
      <FloatingActionButton onTouchTap={this.handleToggleCamera} secondary={this.state.camera}
        style={this.styles.zoombtn}>
        {this.state.camera ? <CameraCloseIcon /> : <CameraOpenIcon />}
      </FloatingActionButton>
    );

    return (
      <div>
        <AddRobotDialog autoDetectWindowHeight
          onRequestClose={this.handleCloseRobotDialog} open={this.state.robotdialog}
        />
        <MapDialogProvider autoDetectWindowHeight
          onRequestClose={this.handleCloseMapDialog} open={this.state.mapdialog}
        />
        <RosieSettings autoDetectWindowHeight
          onRequestClose={this.handleCloseSettings} open={this.state.settings}
        />

        <Drawer docked={false} onRequestChange={this.handleChangeDrawer} open={this.state.drawer}>
          <List style={{ height: '75%' }}>
            {this.props.robots.map((r, i) => (
              <ListItem key={i} onTouchTap={this.handleRobotListClick(r.id)} primaryText={r.id}
                secondaryText={`${r.robot.host}:${r.robot.port}`}
              />
            ))}
          </List>
          <Divider/>
          <MenuItem leftIcon={<ContentAddIcon />} onTouchTap={this.handleAddRobot}
            primaryText='Add robot'
          />
          <MenuItem leftIcon={<MapIcon />} onTouchTap={this.handleChangeMap}
            primaryText='Select map'
          />
          <MenuItem leftIcon={<SettingsIcon />} onTouchTap={this.handleChangeSettings}
            primaryText='Settings'
          />
        </Drawer>

        <div className='flex column wrap start' style={this.styles.appContainer}>
          <RosieAppBar onLeftIconButtonTouchTap={this.handleToggleDrawer} />
          <RosieMap ref={(r) => this.rosiemap = r} />

          {this.props.mode.user && this.showJoystick() ?
            <RosieJoystick style={this.styles.joystickContainer} /> : undefined}
          {this.props.mode.path ? <RosiePathAction style={this.styles.actionsContainer}/> : undefined}
          {this.state.camera ? <RosieWebCam /> : undefined}

          <div className='actions' style={this.styles.zoombtns}>
            {this.props.selected && this.props.hasCamera ? camerabutton : undefined}
            <FloatingActionButton disabled={!this.state.zoomin} onTouchTap={this._handleZoomIn}
              style={this.styles.zoombtn}>
              <ZoomInIcon />
            </FloatingActionButton>
            <FloatingActionButton disabled={!this.state.zoomout} onTouchTap={this._handleZoomOut}
              style={this.styles.zoombtn}>
              <ZoomOutIcon />
            </FloatingActionButton>
          </div>
          <ReportSnackbar autoHideDuration={2000} level={this.props.report.level}
            message={this.props.report.text} onRequestClose={this.props.handleClearReport}
            open={this.props.notification}
          />
        </div>
      </div>
    );
  }
}
