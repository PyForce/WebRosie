import $ from 'jquery'


// robot class with rosie API
export default class Robot {
  constructor(host = document.domain, port = location.port, video = 8080) {
    this.host = host;
    this.port = port;
    this.video = video;
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
      url: `http://${this.host}:${this.port}/${route}${param ? `/${param}` : ''}`,
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
