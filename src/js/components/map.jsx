import React from 'react'
import L from 'leaflet'

import { addMapOverlay, moveRobot, selectRobot } from '../actions'


export default class Map extends React.Component {
  componentDidMount() {
    let app = L.map('map', {
      crs: L.CRS.Simple,
      zoomAnimation: false
    }).setView([0, 0], 9);
  }

  shouldComponentUpdate(nextProps) {
    let { robot, dispatch } = nextProps;
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

        obj.overlay = new RobotOverlay(image, [0, 0], ...data.size);
        // put the leaflet overlay into the map
        dispatch(addMapOverlay(id));
        $(obj.overlay._image).click(() => {
          // set this robot as selected on overlay click
          dispatch(selectRobot(id));
          // don't propagate event
          return false;
        });

        // move to the initial position
        obj.odometry().done((pos) => dispatch(moveRobot(id, pos)));
      });
    }

    // prevent component from re-rendering
    return false;
  }

  render() {
    return (
      <div id='map' className='grow' />
    );
  }
};
