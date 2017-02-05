import fetch from 'isomorphic-fetch';


// robot class with rosie API
export default class Robot {
  constructor (host = document.domain, port = location.port, video = 8080) {
    this.host = host;
    this.port = port;
    this.video = video;
    this.sio = new WebSocket(`ws://${host}:${port}/websocket`);
  }

  // API
  keys (keys) {
    this.sio.send(JSON.stringify({type: 'keys', data: keys}));
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

  // POST: /path
  // {
  //    path: `coordinate list`,
  //    smooth: `wether or not to smooth the path`,
  //    interpolation: `interpolation type`,
  //    k: `constant`,
  //    time: `finish time`
  // }
  path (path) {
    return this.post('path', path);
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

  get (route, param) {
    let url = `http://${this.host}:${this.port}/${route}${param ? `/${param}` : ''}`;

    return fetch(url)
      .then((response) => response.json());
  }

  post (route, param) {
    return fetch(`http://${this.host}:${this.port}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param),
      mode: 'no-cors'
    });
  }
}
