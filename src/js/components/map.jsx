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

    this.map.on('click', () => {
      if (!this.props.mode.path) {
        this.props.selectRobot();
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
      overlay.angle = move.theta;
    });
  }

  componentWillReceiveProps (nextProps) {
    let { robot, map } = nextProps;

    if (robot) {
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
        obj.odometry().then((pos) => this.props.moveRobot(id, pos));
      }, (error) => {
        // notify of connection error
        this.props.notify(`Couldn't connect to ${obj.host}:${obj.port}`);
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
