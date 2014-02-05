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
  $scope.lista_barrios = barrios;

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
    console.log($scope.barrio_filter);
    sortByBarrio($scope.barrio_filter);
  }
});



