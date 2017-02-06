import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Snackbar from 'material-ui/Snackbar';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import MapIcon from 'material-ui/svg-icons/maps/map';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import ZoomOutIcon from 'material-ui/svg-icons/action/zoom-out';

import RosieMap from '../containers/rosiemap';
import RosieAppBar from '../containers/rosiebar';
import MapDialogProvider from '../containers/mapdialog';
import AddRobotDialog from './robotdialog';
import { ORDER_MODE, USER_MODE } from '../actions';


export default class MainApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      drawer: false,
      robotdialog: false,
      mapdialog: false,
      zoomin: true,
      zoomout: true,
      notification: false,
      message: ''
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.acceptRobot = this.acceptRobot.bind(this);
    this.acceptMap = this.acceptMap.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    // map zoom control
    this._zoomIn = this._zoomIn.bind(this);
    this._zoomOut = this._zoomOut.bind(this);
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
  }

  componentDidMount () {
    let store = this._reactInternalInstance._context.store;
    store.subscribe(() => {
      let { message, robot, robots, lastaction, mode, keys } = store.getState();
      if (message) {
        this.setState({ message, notification: true });
      }

      if (robot < 0) {
        return;
      }

      let selectedRobot = robots[robot].robot;
      // mode action, change real robot mode accordingly
      if (lastaction >= ORDER_MODE && lastaction <= USER_MODE) {
        if (mode.user) {
          selectedRobot.manual();
        } else {
          selectedRobot.auto();
        }
      }

      selectedRobot.keys(keys);
    });
  }

  toggleDrawer () {
    this.setState({ drawer: !this.state.drawer });
  }

  acceptRobot (accepted, ...data) {
    if (accepted) {
      this.props.addRobot(...data);
    }

    // hide the robotdialog
    this.setState({ robotdialog: false });
  }

  acceptMap (accepted, data) {
    if (accepted) {
      this.props.loadMap(data);
    }

    // hide the robotdialog
    this.setState({ mapdialog: false });
  }

  _zoomIn (e) {
    let map = this.refs.rosiemap.getWrappedInstance().map;
    if (map._zoom >= map.getMaxZoom()) {
      return;
    }
    map.zoomIn(map.options.zoomDelta * (e.shiftKey ? 3 : 1));
  }

  _zoomOut (e) {
    let map = this.refs.rosiemap.getWrappedInstance().map;
    if (map._zoom <= map.getMinZoom()) {
      return;
    }
    map.zoomOut(map.options.zoomDelta * (e.shiftKey ? 3 : 1));
  }

  handleKeyDown (event) {
    let store = this._reactInternalInstance._context.store;
    if (store.getState().mode.user) {
      this.props.keyDown(event.which);
    }
  }

  handleKeyUp (event) {
    let store = this._reactInternalInstance._context.store;
    if (store.getState().mode.user) {
      this.props.keyUp(event.which);
    }
  }

  render () {
    let zoombtns = {
      position: 'absolute',
      bottom: 0,
      margin: '0 0 1% 1%',
      zIndex: 1000
    };
    let zoombtn = {
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
          <Snackbar open={this.state.notification} message={this.state.message}
                    autoHideDuration={2000}
                    onRequestClose={() => this.setState({notification: false})} />
        </div>
      </div>
    );
  }
};
