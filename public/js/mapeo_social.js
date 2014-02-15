var app = angular.module('mapeo_social', [
        //'ui.mask',
        //'ngAnimate',
        //'adminControllers',
        //'jusypazFilters',
        //'adminServices',
        //'ui.bootstrap',
        'ngRoute'
        ]);

app.controller("ControlsCtrl", function ControlsCtrl($scope, $http, $timeout) {

  $scope.playing = false;
  $scope.lista_barrios        = barrios;
  $scope.lista_barrios.unshift("TODOS");
  $scope.lista_subcategorias  = subcategorias ;
  $scope.lista_subcategorias.unshift("TODOS");
  $scope.lista_categorias     = categorias;
  $scope.lista_categorias.unshift("TODOS");
  $scope.lista_etiquetas      = etiquetas ;
  $scope.lista_etiquetas.unshift("TODOS");

  $scope.start_animation = function() {
    startAnimation();
    var play = document.getElementById("play");
    play.src="/img/pause.png";
    $scope.playing=true;
  }

  $scope.stop_animation = function() {
  if (current_timeout) {
      clearTimeout(current_timeout);
    }

    var play = document.getElementById("play");
    play.src="/img/play.png";
    $scope.playing = false;
  }


  $scope.rewind_animation = function() {
    $scope.stop_animation();
    idx = 0; 
    if (newLayer) {
      map.removeLayer(newLayer);
    }

  }

  $scope.toggle_play = function() {
    if ($scope.playing) {
      $scope.stop_animation();
    } else {
     $scope.start_animation();
    }
  }
  
  $scope.filter_by_barrio = function() {
    sortByBarrio($scope.barrio_filter);
  }
  
  $scope.filter_by_etiqueta = function() {
    sortByEtiqueta($scope.etiqueta_filter);
  }
  
  $scope.filter_by_categoria = function() {
    sortByCategoria($scope.categoria_filter);
  }
  
  $scope.filter_by_subcategoria = function() {
    sortBySubcategoria($scope.subcategoria_filter);
  }
});



