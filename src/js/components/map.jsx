import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import draw from '../map/map';
import RobotOverlay from '../map/robot';


export default class LMap extends React.Component {
  static propTypes = {
    mode: PropTypes.shape({
      single: PropTypes.bool,
      path: PropTypes.bool,
      user: PropTypes.bool,
      order: PropTypes.bool
    }),
    modeOff: PropTypes.func,
    selectRobot: PropTypes.func,
    robotGoto: PropTypes.func,
    addPoint: PropTypes.func,
    moveRobot: PropTypes.func,
    notify: PropTypes.func,
    removeRobot: PropTypes.func,
    robot: PropTypes.shape({
      id: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
      robot: PropTypes.object
    }),
    map: PropTypes.object,
    path: PropTypes.array,
    move: PropTypes.shape({
      id: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      theta: PropTypes.number
    }),
    pathClear: PropTypes.func,
    selected: PropTypes.number,
  }

  componentDidMount () {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      zoomAnimation: false,
      zoomControl: false
    }).setView([ 0, 0 ], 9);

    const muiTheme = this._reactInternalInstance._context.muiTheme;

    this.marker = L.circleMarker([ 0, 0 ], {
      color: muiTheme.palette.accent1Color
    });

    this.map.on('click', (event) => {
      if (!(this.props.mode.single || this.props.mode.path)) {
        // return the robot to auto mode
        this.props.modeOff();
        // deselect the robot on map click
        this.props.selectRobot();
      }

      const { lat: y, lng: x } = event.latlng;

      if (this.props.mode.single) {
        this.map.removeLayer(this.marker);
        this.props.robotGoto(x, y);
        this.marker.addTo(this.map).setLatLng(event.latlng);
        return;
      }

      if (!this.props.mode.path) {
        return;
      }

      this.props.addPoint([ x, y ]);
    });

    this.path = L.polyline([], {
      color: muiTheme.palette.accent1Color
    }).addTo(this.map);
    this.realPath = L.polyline([], {
      color: muiTheme.palette.accent3Color
    }).addTo(this.map);
  }

  componentWillReceiveProps (nextProps) {
    const { robot, map, path, move, pathClear, selected, mode } = nextProps;

    if (pathClear) {
      this.path.setLatLngs([]);
      this.realPath.setLatLngs([]);
    }
    else if (path !== this.props.path) {
      const store = this._reactInternalInstance._context.store;
      const overlay = store.getState().robots.find((elem) => elem.id === selected).robot.overlay;

      const latlngs = path.map((elem) => [ elem[1], elem[0] ]);
      latlngs.unshift(overlay.latlng);

      this.path.setLatLngs(latlngs);
    }

    if (mode !== this.props.mode && !mode.single) {
      this.map.removeLayer(this.marker);
    }

    if (move) {
      this.updateRobotPos(move);
    }

    if (robot && robot !== this.props.robot) {
      const { robot: obj, id } = robot;

      obj.sio.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        switch(data.type) {
        case 'position':
          this.props.moveRobot(id, data.data);
        }
      };

      obj.metadata().then((data) => {
        // construct the image URL
        const image = `http://${obj.host}:${obj.port}${data.vector}`;

        obj.overlay = new RobotOverlay(image, [ 0, 0 ],
          data.size[1], data.size[0], {
            interactive: true,
            nonBubblingEvents: [ 'click' ]
          });
        // put the leaflet overlay into the map
        obj.overlay.addTo(this.map)
          .on('click', () => {
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
      })
      .catch(() => {
        // notify of connection error
        this.props.notify(`Couldn't connect to ${obj.host}:${obj.port}`, 'error');
        this.props.removeRobot(id);
      });
    }

    // draw the new map
    if (map !== this.props.map) {
      const { palette } = this._reactInternalInstance._context.muiTheme;

      draw(map, this.map, {
        borders: { color: palette.disabledColor },
        walls: { color: palette.textColor, opacity: 0.8 },
        doors: { color: palette.primary1Color, opacity: 0.75 },
        items: { color: palette.accent1Color }
      });
    }
  }

  shouldComponentUpdate () {
    // prevent component from re-rendering
    return false;
  }

  updateRobotPos = (move) => {
    const store = this._reactInternalInstance._context.store;
    const { robots, robot } = store.getState();

    const overlay = robots.find((elem) => elem.id === move.id)
      .robot.overlay;
    // check if this is a 'select' move
    if ('x' in move && 'y' in move && 'theta' in move) {
      overlay.pos = move;
      overlay.angle = move.theta;
    }

    if (move.id !== robot) {
      return;
    }

    const bounds = this.map.getBounds();

    if (bounds.getNorth() < overlay.latlng.lat ||
          bounds.getEast() < overlay.latlng.lng ||
          bounds.getSouth() > overlay.latlng.lat ||
          bounds.getWest() > overlay.latlng.lng) {
      this.map.panTo(overlay.latlng);
    }

    if (this.props.mode.path) {
      this.realPath.addLatLng(overlay.latlng);
    }
  }

  render () {
    return (
      <div className='grow' id='map' />
    );
  }
}
