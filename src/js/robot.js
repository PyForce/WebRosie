import fetch from 'isomorphic-fetch';


// robot class with rosie API
export default class Robot {
  constructor (host = document.domain, port = location.port, video = 8080) {
    this.host = host;
    this.port = port;
    this.video = video;
    try {
      this.sio = new WebSocket(`ws://${host}:${port}/websocket`);
    }
    catch (ReferenceError) {
      // no WebSocket
    }

    this.metadata()
      .then((info) => {
        this.name = info.name;
      });
  }

  // API
  move (dir) {
    this.sio.send(JSON.stringify({type: 'move', data: dir}));
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
  // }
  goto (pos) {
    return this.post('goto', {target: pos});
  }

  // POST: /gotoplanner
  // {
  //    target: [x, y, t]
  // }
  gotoplanner (pos) {
    return this.post('gotoplanner', {target: pos});
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

    return fetch(url)
      .then((response) => response.json());
  }

  post (route, param) {
    let headers = new Headers({
      'Content-Type': 'application/json;charset=UTF-8'
    });

    return fetch(`http://${this.host}:${this.port}/${route}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(param),
      mode: 'no-cors',
    });
  }
}
