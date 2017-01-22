import L from 'leaflet'


L.DomUtil.setTransform = (el, offset, scale, angle) => {
  let pos = offset || new L.Point(0, 0);

  let translate = L.Browser.ie3d ?
    `translate(${pos.x}px, ${pos.y}px)` : `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  let rotate = angle ? `rotate(${angle}rad)` : '';
  let scl = scale ? then `scale(#{scale})` : '';

  el.style[L.DomUtil.TRANSFORM] = `${translate}${rotate}${scl}`
};


L.DomUtil.setPosition = (el, point, angle) => {
  el._leaflet_pos = point;

  if(L.Browser.any3d)
    L.DomUtil.setTransform(el, point, undefined, angle);
  else {
    el.style.left = `${point.x}px`;
    el.style.top = `${point.y}px`;
  }
};


// draws a geoJSON map on the provided leaflet map
export default function draw(json_map, leaflet_map) {
  // style for the map
  let style = {
    borders: {
      color: 'rgba(0, 0, 255, 0.25)',
      weight: 0
    },
    walls: {
      color: '#101010',
      weight: 5
    },
    doors: {
      color: '#0000ef',
      weight: 10,
      opacity: 0.5
    },
    items: {
      color: '#0f0f0f',
      weight: 1,
      opacity: 0.75
    }
  };
  // drawing color
  let color = .25;

  for (room of json_map.rooms)
    for (elements of json_map.rooms[room]) {
      if (elements === 'borders') {
        let border_style = {
          color: `rgba(0, 0, 255, ${color})`,
          weight: 0
        };

        L.geoJson(json_map.rooms[room][elements], {style: border_style})
          .addTo(leaflet_map);
        color += 0.25;
        if (color > .8)
          color = .25
      }
      else if (elements === 'items')
        for (item of json_map.rooms[room][elements])
          L.geoJson(json_map.rooms[room][elements][item], {
            style: style[elements]
          }).addTo(leaflet_map);
      else
        L.geoJson(json_map.rooms[room][elements], {
          style: style[elements]
        }).addTo(leaflet_map);
    }
};
