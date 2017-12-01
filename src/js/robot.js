import axios from 'axios';


// robot class with rosie API
export default class Robot {
  static _respTransform = (response) => response.data;

  constructor (host, port, name = '') {
    this.host = host;
    this.port = port;
    this.name = name;

    try {
      this.sio = new WebSocket(`ws://${host}:${port}/websocket`);
    }
    catch (ReferenceError) {
      // no WebSocket
    }

    this.axios = axios.create({
      baseURL: `http://${this.host}:${this.port}/`
    });
  }

  // API
  move (dir) {
    this.sio.send(JSON.stringify({ type: 'move', data: dir }));
  }

  // GET: /sensor/`name`
  sensor (name) {
    return this.get('sensor', name);
  }

  // GET: /odometry
  odometry () {
    return this.get('odometry');
  }

  // GET: /metadata
  metadata () {
    return this.get('metadata');
  }

  // alias for odometry
  get pos () {
    return this.odometry();
  }

  // POST: /pos
  // {
  //    x: `x position`,
  //    y: `y position`,
  //    theta: `theta angle`
  // }
  set pos (pos) {
    return this.post('position', pos);
  }

  // POST: /goto
  // {
  //    target: [x, y, t],
  //    planner: false
  // }
  goto (pos, planner) {
    return this.post('goto', { target: pos, planner });
  }

  // POST: /follow
  // {
  //    path: [[x, y, t], [x, y, t], ...],
  // }
  follow (path) {
    return this.post('follow', path);
  }

  command (command) {
    return this.post('text', command);
  }

  // POST: /manual_mode
  manual () {
    return this.post('manual_mode');
  }

  // POST: /auto_mode
  auto () {
    return this.post('auto_mode');
  }

  // GET: /maps
  maps () {
    return this.get('maps');
  }

  // GET: /map/`name`
  map (name) {
    return this.get('map', name);
  }

  get (route, param) {
    return this.axios.get(`/${route}${param ? `/${param}`: ''}`)
      .then(Robot._respTransform);
  }

  post (route, data) {
    return this.axios.post(`/${route}`, data).then(Robot._respTransform);
  }
}
