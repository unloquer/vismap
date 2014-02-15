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
var barrios = [];
var categorias = [];
var subcategorias = [];
var etiquetas = [];

var centers = [];
var poligons= [];

var all_layer = L.geoJson(all_data).addTo(map); 
var unfiltered = crossfilter().add(all_data.features);
sortData(all_data);

var f_barrio    = unfiltered.dimension(function(d) { return d.properties['BARRIO']} ); 
var f_categoria = unfiltered.dimension(function(d) { return d.properties['CATEGORIA']} ); 
var f_etiqueta  = unfiltered.dimension(function(d) { return d.properties['ETIQUETA']} ); 
var f_subcategoria = unfiltered.dimension(function(d) { return d.properties['SUBCATEGORIA']} ); 

var show_objects = all_data.features;

get_animation_objects();

function get_animation_objects() {
  centers = [];
  poligons = [];
  for (var bar in show_objects) {
      var geometry = show_objects[bar].geometry.coordinates;
      calcCenters(geometry, show_objects[bar] ); 
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
  
  html = '<div class="data_frame"><p class="barrio">' + poligons[idx].properties['BARRIO'] + "</p>";
  html = html + '<label>Categoria de Analisis:</label><p class="data_text">' + poligons[idx].properties['CATEGORIA'] + "</p>";
  html = html + '<label>Subcategoria de analisis</label><p class="data_text">' + poligons[idx].properties['SUBCATEGORIA'] + "</p>";
  html = html + '<label>Descripción</label><p class="data_text">' + poligons[idx].properties['DESCRIPCION'] + "</p>";
  html = html + '<label>Etiqueta</label><p class="data_text">' + poligons[idx].properties['ETIQUETA'] + "</p>";
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
    var barrio = all_data.features[p].properties['BARRIO'];
    if (barrios.indexOf(barrio) < 0) {
      barrios.push(barrio);
    }
    var etiqueta = all_data.features[p].properties['ETIQUETA'];
    if (etiquetas.indexOf(etiqueta) < 0) {
      etiquetas.push(etiqueta);
    }
    var categoria = all_data.features[p].properties['CATEGORIA'];
    if (categorias.indexOf(categoria) < 0) {
      categorias.push(categoria);
    }
    var subcategoria = all_data.features[p].properties['SUBCATEGORIA'];
    if (subcategorias.indexOf(subcategoria) < 0) {
      subcategorias.push(subcategoria);
    }
    all_data.features[p].properties["show_on_map"] = true;
    //console.log(barrio);
  }

}

var visible = [];

function filterData() {
  map.removeLayer(all_layer);
  all_layer = null;
  all_layer = L.geoJson(visible).addTo(map);
  show_objects = visible;
  if (newLayer) {
    map.removeLayer(newLayer);
  }
  get_animation_objects();
}

function sortByBarrio(barrio) {
  if (barrio == "TODOS") {
    visible = f_barrio.filterAll().top(Infinity);
  } else {
    visible = f_barrio.filter(barrio).top(Infinity);
  }
  filterData();
}

function sortByCategoria(cat) {
  if (cat == "TODOS") {
    visible = f_categoria.filterAll().top(Infinity);
  } else {
    visible = f_categoria.filter(cat).top(Infinity);
  }
  filterData();
}

function sortBySubcategoria(cat) {
  if (cat == "TODOS") {
    visible = f_subcategoria.filterAll().top(Infinity);
  } else {
    visible = f_subcategoria.filter(cat).top(Infinity);
  }
  filterData();
}

function sortByEtiqueta(et) {
  if (cat == "TODOS") {
    visible = f_etiqueta.filterAll().top(Infinity);
  } else {
    visible = f_etiqueta.filter(et).top(Infinity);
  }
  filterData();
}
