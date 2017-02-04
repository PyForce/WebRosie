import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ZoomOut from 'material-ui/svg-icons/action/zoom-out';

import RosieMap from '../containers/rosiemap';
import AddRobotDialog from './robotdialog';


export default class MainApp extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      drawer: false,
      loading: true,
      dialog: false,
      zoomin: true,
      zoomout: true
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this._zoomIn = this._zoomIn.bind(this);
    this._zoomOut = this._zoomOut.bind(this);
  }

  componentWillMount () {
    let load = () => {
      this.setState({ loading: false }, () => {
        let map = this.refs.rosiemap.getWrappedInstance().map;
        map.on('zoomend zoomlevelschange', () => {
          let disabledOut = map._zoom <= map.getMinZoom();
          let disabledIn = map._zoom >= map.getMaxZoom();

          this.setState({zoomin: !disabledIn, zoomout: !disabledOut});
        });
      });
    };
    window.addEventListener('load', load);
  }

  toggleDrawer () {
    this.setState({ drawer: !this.state.drawer });
  }

  openDialog () {
    this.setState({ dialog: true, drawer: false });
  }

  closeDialog (accepted, ...data) {
    if (accepted) {
      this.props.onAddRobot(...data);
    }

    // hide the dialog
    this.setState({ dialog: false });
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

  render () {
    let pageContent;
    if (this.state.loading) {
      pageContent = <CircularProgress className='grow' />;
    }
    else {
      let zoombtns = {
        position: 'absolute',
        bottom: 0,
        margin: '0 0 1% 1%'
      };
      let zoombtn = {
        display: 'block'
      };

      pageContent = <div className="grow">
      <RosieMap ref='rosiemap' />
      <div style={zoombtns}>
        <FloatingActionButton style={{...zoombtn, margin: '0 0 20%'}} onTouchTap={this._zoomIn}
          disabled={!this.state.zoomin}>
          <ZoomIn />
        </FloatingActionButton>
        <FloatingActionButton style={zoombtn} onTouchTap={this._zoomOut}
          disabled={!this.state.zoomout}>
          <ZoomOut />
        </FloatingActionButton>
      </div>
      </div>;
    }

    return (
      <div>
        <AddRobotDialog open={this.state.dialog} onRequestClose={this.closeDialog}/>

        <Drawer open={this.state.drawer} docked={false}
                onRequestChange={(open) => this.setState({ drawer: open })}>
          <MenuItem primaryText="Add robot" leftIcon={<ContentAddIcon />}
            onTouchTap={this.openDialog}/>
        </Drawer>

        <div style={{height: '100%'}} className='flex column wrap'>
          <AppBar onLeftIconButtonTouchTap={this.toggleDrawer} />
          {pageContent}
        </div>
      </div>
    );
  }
};
