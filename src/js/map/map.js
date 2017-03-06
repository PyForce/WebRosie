import L from 'leaflet';

const defaultTheme = {
  borders: { color: 'rgba(0, 0, 255, 0.25)', weight: 0 },
  walls: { color: '#101010', weight: 5 },
  doors: { color: '#0000ef', weight: 10, opacity: 0.5 },
  items: { color: '#0f0f0f', weight: 1, opacity: 0.75 }
};

// draws a geoJSON map on the provided leaflet map
export default function draw (jsonMap, leafletMap, theme) {
  // style for the map
  const style = defaultTheme;
  // drawing opacity
  let opacity = .25;

  if (theme) {
    for (const elem in style) {
      // update style with theme parameter values
      if (elem in theme) {
        style[elem] = { ...style[elem], ...theme[elem] };
      }
    }
  }

  for (const room in jsonMap.rooms) {  // eslint-disable-line guard-for-in
    for (const element in jsonMap.rooms[room]) {
      if (element === 'borders') {
        const borderStyle = {
          color: style.borders.color,
          fillOpacity: opacity,
          weight: 0
        };

        L.geoJson(jsonMap.rooms[room][element], { style: borderStyle })
          .addTo(leafletMap);
        opacity += 0.25;
        if (opacity > .8) {
          opacity = .25;
        }
      }
      else if (element === 'items') {
        for (const item in jsonMap.rooms[room][element]) {  // eslint-disable-line guard-for-in
          L.geoJson(jsonMap.rooms[room][element][item], {
            style: style[element]
          }).addTo(leafletMap);
        }
      }
      else {
        L.geoJson(jsonMap.rooms[room][element], {
          style: style[element]
        }).addTo(leafletMap);
      }
    }
  }
}
