import L from 'leaflet';


// draws a geoJSON map on the provided leaflet map
export default function draw (jsonMap, leafletMap) {
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

  for (let room of jsonMap.rooms) {
    for (let elements of jsonMap.rooms[room]) {
      if (elements === 'borders') {
        let borderStyle = {
          color: `rgba(0, 0, 255, ${color})`,
          weight: 0
        };

        L.geoJson(jsonMap.rooms[room][elements], {style: borderStyle})
          .addTo(leafletMap);
        color += 0.25;
        if (color > .8) {
          color = .25;
        }
      }
      else if (elements === 'items') {
        for (let item of jsonMap.rooms[room][elements]) {
          L.geoJson(jsonMap.rooms[room][elements][item], {
            style: style[elements]
          }).addTo(leafletMap);
        }
      }
      else {
        L.geoJson(jsonMap.rooms[room][elements], {
          style: style[elements]
        }).addTo(leafletMap);
      }
    }
  }
};
