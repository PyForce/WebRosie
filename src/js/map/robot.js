import L from 'leaflet';


L.DomUtil.setTransform = (el, offset, scale, angle) => {
  const pos = offset || new L.Point(0, 0);

  // rotation is inverted on the page
  const translate = L.Browser.ie3d ?
    `translate(${pos.x}px, ${pos.y}px)` : `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  const rotate = angle ? `rotate(${-angle}rad)` : '';
  const scl = scale ? `scale(${scale})` : '';

  el.style[L.DomUtil.TRANSFORM] = `${translate}${rotate}${scl}`;
};


L.DomUtil.setPosition = (el, point, angle) => {
  el['_leaflet_pos'] = point;

  if(L.Browser.any3d) {
    L.DomUtil.setTransform(el, point, undefined, angle);
  }
  else {
    el.style.left = `${point.x}px`;
    el.style.top = `${point.y}px`;
  }
};


export default class RobotOverlay extends L.ImageOverlay {
  constructor (_url, latlng, _width, _height, options) {
    super();
    this._url = _url;
    this._width = _width;
    this._height = _height;
    this._latlng = L.latLng(latlng);
    this._angle = 45;

    this._recalcBounds();
    L.setOptions(this, options);
  }

  _recalcBounds () {
    const sw = [
      this._latlng.lat + this._height / 2,
      this._latlng.lng - this._width / 2
    ];
    const ne = [
      this._latlng.lat - this._height / 2,
      this._latlng.lng + this._width / 2
    ];

    this._bounds = L.latLngBounds(sw, ne);
  }

  _reset () {
    const image = this._image;
    const bounds = new L.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        this._map.latLngToLayerPoint(this._bounds.getSouthEast()));
    const size = bounds.getSize();

    const point = {
      x: (bounds.min.x),
      y: (bounds.min.y)
    };

    L.DomUtil.setPosition(image, point, this._angle);
    image.style.width = `${size.x}px`;
    image.style.height = `${size.y}px`;
    image.style.zIndex = '1000';
  }

  set angle (angle) {
    this._angle = angle;
    this._reset();
  }

  get pos () {
    return [ this._latlng.lat, this._latlng.lng ];
  }

  set pos (value) {
    this.latlng = [ value.y, value.x ];
  }

  get angle () {
    return this._angle;
  }

  set latlng (latlng) {
    const oldLatLng = this._latlng;
    this._latlng = L.latLng(latlng);

    this._recalcBounds();

    if (this._map) {
      this._reset();
    }

    if (L.DomUtil.TRANSFORM) {
      // use the CSS transform rule if available
      this._image.style[L.DomUtil.TRANSFORM] += ` rotate(${this.options.angle}rad)`;
    }

    this.fire('move', {
      oldLatLng: oldLatLng,
      latLlng: this._latlng
    });
  }

  get latlng () {
    return this._latlng;
  }
}
