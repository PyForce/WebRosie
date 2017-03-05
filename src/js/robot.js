import request from 'superagent';


// robot class with rosie API
export default class Robot {
  constructor (host = document.domain, port = location.port) {
    this.host = host;
    this.port = port;

    try {
      this.sio = new WebSocket(`ws://${host}:${port}/websocket`);
    }
    catch (ReferenceError) {
      // no WebSocket
    }

    this.metadata()
      .then((info) => {
        this.name = info.name;

        let { video } = info;
        if (video && video.startsWith(':')) {
          this.video = `http://${this.host}${video}`;
          return;
        }
        this.video = video;
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
    let url = `http://${this.host}:${this.port}/${route}${param ? `/${param}` : ''}`;

    return request.get(url)
      .accept('json')
      .then((response) => response.body);
  }

  post (route, param) {
    return request.post(`http://${this.host}:${this.port}/${route}`)
        .type('json')
        .accept('json')
        .send(param)
        .then((response) => response.body);
  }
}
