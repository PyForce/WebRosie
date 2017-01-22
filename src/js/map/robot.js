import L from 'leaflet'


export default class RobotOverlay extends L.ImageOverlay {
  constructor(_url, latlng, _width, _height, options) {
    super();
    this._url = _url;
    this._width = _width;
    this._height = _height;
    this._latlng = L.latLng(latlng);
    this._angle = 45;

    this._recalcBounds();
    L.setOptions(this, options);
  }

  _recalcBounds() {
    let sw = [
        this._latlng.lat + this._height / 2,
        this._latlng.lng - this._width / 2
      ],
      ne = [
        this._latlng.lat - this._height / 2,
        this._latlng.lng + this._width / 2
      ];

    this._bounds = L.latLngBounds(sw, ne);
  }

  _reset() {
    let image = this._image;
    let bounds = new L.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        this._map.latLngToLayerPoint(this._bounds.getSouthEast()));
    let size = bounds.getSize();

    let point = {
      x: (bounds.min.x),
      y: (bounds.min.y)
    };

    L.DomUtil.setPosition(image, point, this._angle);
    image.style.width = `${size.x}px`;
    image.style.height = `${size.y}px`;
    image.style.zIndex = '1000';
  }

  setAngle(angle) {
    this._angle = angle;
    this._reset();
  }

  getAngle() {
    return this._angle
  }

  setLatLng(latlng) {
    let oldLatLng = this._latlng;
    this._latlng = L.latLng(latlng);

    this._recalcBounds();

    if (this._map)
      this._reset();

    if (L.DomUtil.TRANSFORM)
      // use the CSS transform rule if available
      this._image.style[L.DomUtil.TRANSFORM] += ` rotate(${this.options.angle}rad)`;

    this.fire('move', {
      oldLatLng: oldLatLng,
      latLlng: this._latlng
    });
  }

  getLatLng() {
    return this._latlng
  }
};
