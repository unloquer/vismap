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

L.geoJson(lineas).addTo(map); 
L.geoJson(poligonos).addTo(map); 
L.geoJson(puntos).addTo(map); 
*/

var all_layer = L.geoJson(all_data).addTo(map); 
var filtered_layer = null;
/*
setTimeout(function() {
  map.panTo(new L.LatLng(6.261663256300778,-75.565408823978458), true, 1, 0.5);
}, 5000);
*/
var barrios = [];
var by_barrio = {};
var centers = [];
var poligons= [];
var show_objects = by_barrio;
sortData(all_data);
//var poligonos = all_data;
/*
for (var p=0; p<poligonos.features.length; p++) {
  var geometry = poligonos.features[p].geometry.coordinates;
  calcCenters(geometry, poligonos.features[p]); 
}
*/
for (var bar in show_objects) {
  for (var q=0; q<show_objects[bar].length; q++) {
    var geometry = show_objects[bar][q].geometry.coordinates;
    calcCenters(geometry, show_objects[bar][q] ); 
  }
}

function calcCenters(geometry, feature) {

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
  //console.log(center);
  centers.push(center);
  poligons.push(feature);
}

var idx = 0;
var data_overlay = document.getElementById('data_overlay');
var newLayer = null; 
var current_timeout = null;
function getNextCenter(center) {
  //console.log(idx);
  if (newLayer) {
    map.removeLayer(newLayer);
  }
  map.panTo(new L.LatLng(center.y,center.x), true, 1, 0.5);
    
  newLayer = L.geoJson(poligons[idx], {
    style: { "color": "red", "opacity": 0.65} 
  }).addTo(map);
  //data_overlay.innerHTML = poligons[idx].ProcesadoDatosMapeo_BARRIO\/SECTOR;// + '<br><br>' + poligons[idx].ProcesadoDatosMapeo_CATEGORIA DE ANALISIS + '<br><br>' + poligons[idx].ProcesadoDatosMapeo_SUB CATEGORIA DE ANALISIS + '<br><br>' + poligons[idx].ProcesadoDatosMapeo_DESCRIPCIÓN + '<br><br>' +poligons[idx].ProcesadoDatosMapeo_ETIQUETA
  html = '<div class="data_frame"><p class="barrio">' + poligons[idx].properties['ProcesadoDatosMapeo_BARRIO\/SECTOR'] + "</p>";
  html = html + '<label>Categoria de Analsis:</label><p class="data_text">' + poligons[idx].properties['ProcesadoDatosMapeo_CATEGORIA DE ANALISIS'] + "</p>";
  html = html + '<label>Subcategoria de analisis</label><p class="data_text">' + poligons[idx].properties['ProcesadoDatosMapeo_SUB CATEGORIA DE ANALISIS'] + "</p>";
  html = html + '<label>Descripción</label><p class="data_text">' + poligons[idx].properties['ProcesadoDatosMapeo_DESCRIPCIÓN'] + "</p>";
  html = html + '<label>Etiqueta</label><p class="data_text">' + poligons[idx].properties.ProcesadoDatosMapeo_ETIQUETA + "</p>";
  html = html + '</div>';
  data_overlay.innerHTML = html;
  idx++;
  if (idx < centers.length) {
    current_timeout = setTimeout(function() { getNextCenter(centers[idx])}, 4000);
  } else {
    if (current_timeout) {
      clearTimeout(current_timeout);
    }
    if (newLayer) {
      map.removeLayer(newLayer);
    }
    map.setView([6.264468256001104, -75.569280418072125 ], 16);
  }
}

function startAnimation() {
  getNextCenter(centers[idx]);
}



function sortData(all_data) {
  for (var p=0; p<all_data.features.length; p++) {
    var barrio = all_data.features[p].properties['ProcesadoDatosMapeo_BARRIO\/SECTOR'];
    if (! by_barrio.hasOwnProperty(barrio)) {
      by_barrio[barrio] = [];
      barrios.push(barrio);
    }
    by_barrio[barrio].push(all_data.features[p]);
    all_data.features[p].properties["show_on_map"] = true;
    //console.log(barrio);
  }

}

function filterData() {
  if (all_layer) {
    map.removeLayer(all_layer);
    all_layer = null;
  }
  if (filtered_layer) {
    map.removeLayer(filtered_layer);
  }
  filtered_layer = L.geoJson(all_data, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
  }).addTo(map);
}

function sortByBarrio(barrio) {
  for (var y=0; y<all_data.features.length; y++) {
    if (all_data.features[y].properties['ProcesadoDatosMapeo_BARRIO\/SECTOR'] == barrio) {
      all_data.features[y].properties['show_on_map'] = true;
    } else {
      all_data.features[y].properties['show_on_map'] = false;
    }
  }
  /*
  for (var b in by_barrio) {
    if (b != barrio) {
     for(var k=0;k<by_barrio[b].length; k++) {
      by_barrio[b][k].properties['show_on_map'] = false;
     }
    } else {
     for(var y=0;k<by_barrio[b].length; y++) {
      by_barrio[b][y].properties['show_on_map'] = true;
     }
    }
  }
  */
  filterData();
}
