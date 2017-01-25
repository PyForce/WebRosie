import React from 'react';
import L from 'leaflet';

import draw from '../map/map';
import RobotOverlay from '../map/robot';


export default class LMap extends React.Component {
  componentDidMount () {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      zoomAnimation: false
    }).setView([0, 0], 9);

    this.map.on('click', () => {
      if (!this.props.mode.path) {
        this.props.deselectRobot();
      }
      // TODO: if the path mode is active,
      // create a new path point
    });

    let store = this._reactInternalInstance._context.store;

    store.subscribe(() => {
      let { move, robots } = store.getState();
      if (!move) {
        return;
      }

      let overlay = robots[move.id].robot.overlay;
      overlay.latlng = [move.x, move.y];
      overlay.angle = move.angle;
    });
  }

  shouldComponentUpdate (nextProps) {
    let { robot, map } = nextProps;
    let { robot: obj, id } = robot;

    if (obj) {
      obj.sio = new WebSocket(`ws://${obj.host}:${obj.port}/websocket`);
      obj.sio.onmessage = (msg) => {
        let data = JSON.parse(msg.data);

        switch(data[0]) {
        case 'position':
          this.props.moveRobot(id, data[1]);
        }
      };

      obj.metadata().done((data) => {
        // construct the image URL
        let image = `http://${obj.host}:${obj.port}${data.vector}`;

        obj.overlay = new RobotOverlay(image, [0, 0],
          data.size[1], data.size[0], {
            interactive: true
          });
        // put the leaflet overlay into the map
        obj.overlay.addTo(this.map);
        obj.overlay.on('click', (event) => {
          // set this robot as selected on overlay click
          this.props.selectRobot(id);
          // don't propagate event
          return false;
        });

        // move to the initial position
        obj.odometry().done((pos) => this.props.moveRobot(id, pos));
      });
    }

    if (map) {
      draw(map, this.map);
    }

    // prevent component from re-rendering
    return false;
  }

  render () {
    return (
      <div id='map' className='grow' />
    );
  }
};
