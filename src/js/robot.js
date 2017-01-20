import $ from 'jquery'

import { addMapOverlay, moveRobot, selectRobot } from './actions'
import store from './store'


// robot class with rosie API
export default class Robot {
  constructor(host = document.domain, port = location.port, video = 8080, id) {
    this.host = host;
    this.port = port;
    this.video = video;

    this.sio = new WebSocket(`ws://${this.host}:${this.port}/websocket`);
    this.sio.onmessage = (msg) => {
      let data = JSON.parse(msg.data);

      switch(data[0]) {
        case 'position':
          store.dispatch(moveRobot(this, data[1]));
      }
    };

    this.metadata().done((data) => {
      // construct the image URL
      let image = `http://${this.host}:${this.port}${data.vector}`;

      this.overlay = new RobotOverlay(image, [0, 0], ...data.size);
      // put the leaflet overlay into the map
      store.dispatch(addMapOverlay(this.overlay));
      $(this.overlay._image).click(() => {
        // set this robot as selected on overlay click
        store.dispatch(selectRobot(id));
        // don't propagate event
        return false;
      });

      // move to the initial position
      this.odometry().done((pos) => store.dispatch(moveRobot(id, pos)));
    });
  }

  // API

  // GET: /sensor/`name`
  sensor(name) {
    return this.get('sensor', name);
  }

  // GET: /odometry
  odometry() {
    return this.get('odometry');
  }

  // GET: /metadata
  metadata() {
    return this.get('metadata');
  }

  // alias for odometry
  get pos() {
    return this.odometry();
  }

  // PUT: /pos
  // {
  //    x: `x position`,
  //    y: `y position`,
  //    theta: `theta angle`
  // }
  set pos(pos) {
    return this.put('position', value);
  }

  // PUT: /path
  // {
  //    path: `coordinate list`,
  //    smooth: `wether or not to smooth the path`,
  //    interpolation: `interpolation type`,
  //    k: `constant`,
  //    time: `finish time`
  // }
  path(path) {
    return this.put('path', path);
  }

  command(command) {
    return this.put('text', command);
  }

  // PUT: /manual_mode
  manual() {
    return this.put('manual_mode');
  }

  // PUT: /auto_mode
  auto() {
    return this.put('auto_mode');
  }

  get(route, param) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/${route}/${param ? param : ''}`,
      method: 'GET',
      crossDomain: true
    });
  }

  put(route, param) {
    return $.ajax({
      url: `http://${this.host}:${this.port}/${route}`,
      method: 'PUT',
      crossDomain: true,
      contentType: 'application/json',
      data: JSON.stringify(param)
    });
  }
}
