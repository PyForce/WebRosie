import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import MapIcon from 'material-ui/svg-icons/maps/map';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import ZoomOutIcon from 'material-ui/svg-icons/action/zoom-out';
import MobileDetect from 'mobile-detect';

import RosieMap from '../containers/rosiemap';
import RosieAppBar from '../containers/rosiebar';
import MapDialogProvider from '../containers/mapdialog';
import AddRobotDialog from './robotdialog';
import ReportSnackbar from './reportsnackbar';
import RosieJoystick from '../containers/rosiejoystick';
import { ORDER_MODE, USER_MODE } from '../actions';


export default class MainApp extends React.Component {
  state = {
    drawer: false,
    robotdialog: false,
    mapdialog: false,
    zoomin: true,
    zoomout: true,
    notification: false,
    report: {
      text: '',
      level: 'info'
    }
  }

  componentWillMount () {
    window.addEventListener('load', () => {
      let map = this.refs.rosiemap.getWrappedInstance().map;
      // disable enable zoom buttons depending on zoom level
      map.on('zoomend zoomlevelschange', () => {
        let disabledOut = map._zoom <= map.getMinZoom();
        let disabledIn = map._zoom >= map.getMaxZoom();

        this.setState({zoomin: !disabledIn, zoomout: !disabledOut});
      });
    });

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    let md = new MobileDetect(window.navigator.userAgent);
    this.isTouch = md.phone() !== null || md.tablet() !== null;
  }

  componentDidMount () {
    let store = this._reactInternalInstance._context.store;
    store.subscribe(() => {
      let { report, robot, robots, direction } = store.getState();
      if (report) {
        this.setState({ report, notification: true });
      }

      if (robot < 0) {
        return;
      }

      let selectedRobot = robots[robot].robot;

      selectedRobot.move(direction);
    });
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

    return (
      <div>
        <AddRobotDialog open={this.state.robotdialog}
                        onRequestClose={this.acceptRobot} />
        <MapDialogProvider open={this.state.mapdialog}
                           onRequestClose={this.acceptMap} />

        <Drawer open={this.state.drawer} docked={false}
                onRequestChange={(open) => this.setState({ drawer: open })}>
          <MenuItem primaryText="Add robot" leftIcon={<ContentAddIcon />}
            onTouchTap={() => this.setState({robotdialog: true, drawer: false})} />
          <MenuItem primaryText="Select map" leftIcon={<MapIcon />}
            onTouchTap={() => this.setState({mapdialog: true, drawer: false})} />
        </Drawer>

        <div style={{height: '100%'}} className='flex column wrap start'>
          <RosieAppBar onLeftIconButtonTouchTap={this.toggleDrawer} />
          <RosieMap ref='rosiemap' />

          {this.props.userMode && this.isTouch ? <RosieJoystick /> : undefined}

          <div style={zoombtns}>
            <FloatingActionButton style={{...zoombtn, margin: '0 0 20%'}}
                                  onTouchTap={this._zoomIn}
                                  disabled={!this.state.zoomin}>
              <ZoomInIcon />
            </FloatingActionButton>
            <FloatingActionButton style={zoombtn} onTouchTap={this._zoomOut}
                                  disabled={!this.state.zoomout}>
              <ZoomOutIcon />
            </FloatingActionButton>
          </div>
          <ReportSnackbar open={this.state.notification} message={this.state.report.text}
                    autoHideDuration={2000} level={this.state.report.level}
                    onRequestClose={() => this.setState({notification: false})} />
        </div>
      </div>
    );
  }
};
