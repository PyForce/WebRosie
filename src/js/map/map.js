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

  for (let room in jsonMap.rooms) {
    for (let element in jsonMap.rooms[room]) {
      if (element === 'borders') {
        let borderStyle = {
          color: `rgba(0, 0, 255, ${color})`,
          weight: 0
        };

        L.geoJson(jsonMap.rooms[room][element], {style: borderStyle})
          .addTo(leafletMap);
        color += 0.25;
        if (color > .8) {
          color = .25;
        }
      }
      else if (element === 'items') {
        for (let item in jsonMap.rooms[room][element]) {
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
};
