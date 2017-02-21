import React from 'react';
import L from 'leaflet';

import draw from '../map/map';
import RobotOverlay from '../map/robot';


export default class LMap extends React.Component {
  componentDidMount () {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      zoomAnimation: false,
      zoomControl: false
    }).setView([0, 0], 9);

    this.map.on('click', (event) => {
      if (!(this.props.mode.single || this.props.mode.path)) {
        // return the robot to auto mode
        this.props.modeOff();
        // deselect the robot on map click
        this.props.selectRobot();
      }

      let {lat: y, lng: x} = event.latlng;

      if (this.props.mode.single) {
        this.props.robotGoto(this.props.selected, [x, y, 10]);
        return;
      }

      if (!this.props.mode.path) {
        return;
      }

      this.props.addPoint([x, y]);
    });

    let muiTheme = this._reactInternalInstance._context.muiTheme;

    this.polyline = L.polyline([], {
      color: muiTheme.palette.accent1Color
    }).addTo(this.map);
  }

  updateRobotPos = (move) => {
    let store = this._reactInternalInstance._context.store;
    let { robots, robot } = store.getState();

    let overlay = robots.find((elem) => elem.id === move.id)
      .robot.overlay;
    overlay.pos = move;
    overlay.angle = move.theta;

    if (move.id !== robot) {
      return;
    }

    let bounds = this.map.getBounds();

    if (bounds.getNorth() < overlay.latlng.lat ||
          bounds.getEast() < overlay.latlng.lng ||
          bounds.getSouth() > overlay.latlng.lat ||
          bounds.getWest() > overlay.latlng.lng) {
      this.map.panTo(overlay.latlng);
    }
  }

  componentWillReceiveProps (nextProps) {
    let { robot, map, path, move, pathClear, selected } = nextProps;

    if (pathClear) {
      this.polyline.setLatLngs([]);
    }
    else if (path !== this.props.path) {
      let store = this._reactInternalInstance._context.store;
      let overlay = store.getState().robots.find((elem) => elem.id === selected).robot.overlay;

      let latlngs = path.map((elem) => [elem[1], elem[0]]);
      latlngs.unshift(overlay.latlng);

      this.polyline.setLatLngs(latlngs);
    }

    if (move) {
      this.updateRobotPos(move);
    }

    if (robot && robot !== this.props.robot) {
      let { robot: obj, id } = robot;

      obj.sio.onmessage = (msg) => {
        let data = JSON.parse(msg.data);

        switch(data.type) {
        case 'position':
          this.props.moveRobot(id, data.data);
        }
      };

      obj.metadata().then((data) => {
        // construct the image URL
        let image = `http://${obj.host}:${obj.port}${data.vector}`;

        obj.overlay = new RobotOverlay(image, [0, 0],
          data.size[1], data.size[0], {
            interactive: true,
            nonBubblingEvents: ['click']
          });
        // put the leaflet overlay into the map
        obj.overlay.addTo(this.map)
          .on('click', (event) => {
            // set this robot as selected on overlay click
            this.props.selectRobot(id);
            // don't propagate event
            return false;
          });

        // move to the initial position
        obj.odometry().then((pos) => {
          this.props.moveRobot(id, pos);
          this.map.panTo(obj.overlay.latlng);
        });
      }, (error) => {
        // notify of connection error
        this.props.notify(`Couldn't connect to ${obj.host}:${obj.port}`, 'error');
        this.props.removeRobot(id);
      });
    }

    // draw the new map
    if (map !== this.props.map) {
      draw(map, this.map);
    }
  }

  shouldComponentUpdate (nextProps) {
    // prevent component from re-rendering
    return false;
  }

  render () {
    return (
      <div id='map' className="grow" />
    );
  }
};
