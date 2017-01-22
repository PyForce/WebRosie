import React from 'react'
import L from 'leaflet'

import { moveRobot, selectRobot } from '../actions'
import draw from '../map/map'
import RobotOverlay from '../map/robot'


export default class LMap extends React.Component {
  componentDidMount() {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      zoomAnimation: false
    }).setView([0, 0], 9);

    this.map.on('click', () => {
      if (!this.props.mode.path)
        this.onDeselectRobot();
      // TODO: if the path mode is active,
      // create a new path point
    });
  }

  shouldComponentUpdate(nextProps) {
    let { robot, map, dispatch } = nextProps;
    let { robot: obj, id } = robot;

    if (obj) {
      obj.sio = new WebSocket(`ws://${obj.host}:${obj.port}/websocket`);
      obj.sio.onmessage = (msg) => {
        let data = JSON.parse(msg.data);

        switch(data[0]) {
          case 'position':
            dispatch(moveRobot(id, data[1]));
        }
      };

      obj.metadata().done((data) => {
        // construct the image URL
        let image = `http://${obj.host}:${obj.port}${data.vector}`;

        obj.overlay = new RobotOverlay(image, [0, 0], data.size[1], data.size[0]);
        // put the leaflet overlay into the map
        obj.overlay.addTo(this.map);
        obj.overlay.on('click', (event) => {
          // set this robot as selected on overlay click
          dispatch(selectRobot(id));
          // don't propagate event
          return false;
        });

        // move to the initial position
        obj.odometry().done((pos) => dispatch(moveRobot(id, pos)));
      });
    }

    if (map)
      draw(map, this.map);

    // prevent component from re-rendering
    return false;
  }

  render() {
    return (
      <div id='map' className='grow' />
    );
  }
};
