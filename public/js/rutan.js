// create a  in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([6.264468256001104, -75.569280418072125 ], 16);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
/*
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
    .openPopup();
*/

L.geoJson(lineas).addTo(map); 
L.geoJson(poligonos).addTo(map); 
L.geoJson(puntos).addTo(map); 

/*
setTimeout(function() {
  map.panTo(new L.LatLng(6.261663256300778,-75.565408823978458), true, 1, 0.5);
}, 5000);
*/
var centers = [];
for (var p=0; p<poligonos.features.length; p++) {
  var geometry = poligonos.features[p].geometry.coordinates;
  calcCenters(geometry); 
}

function calcCenters(geometry) {

  x_neg = false;
  y_neg = false;
  first_x = geometry[0][0][0];
  first_y = geometry[0][0][1];
  max_x = Math.abs(first_x);
  max_y = Math.abs(first_y);
  min_x = Math.abs(first_x);
  min_y = Math.abs(first_y);
  if (first_x < 0) {
    x_neg = true;
  }
  if (first_y < 0) {
   y_neg = true;
  } 
  for (var i=1;i<geometry[0].length; i++) {
    x = Math.abs(geometry[0][i][0]);
    y = Math.abs(geometry[0][i][1]);
    if (x<min_x) {
      min_x = x;
    }
    if (x>max_x) {
      max_x = x;
    }
    if (y<min_y) {
      min_y = y;
    }
    if (y>max_y) {
      max_y = y;
    }
  }  
  center = {} ;
  center.x = min_x + ((max_x - min_x) / 2);
  center.y = min_y + ((max_y - min_y) / 2);
  if (x_neg) {
    center.x = 0 - center.x;
  }
  if (y_neg) {
    center.y = 0 - center.y;
  }
  console.log(center);
  centers.push(center);
}
var idx = 0;
function getNextCenter(center) {
  console.log(idx);
  map.panTo(new L.LatLng(center.y,center.x), true, 1, 0.5);
  idx++;
  if (idx < centers.length) {
    setInterval(getNextCenter, 4000, centers[idx]);
  } else {
    clearInterval();
  }
}

setInterval(getNextCenter, 4000, centers[idx]);
