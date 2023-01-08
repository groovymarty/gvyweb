angular.module('gvyweb').controller('HouseCtrl', [
  '$scope', '$http', '$interval',
  function($scope, $http, $interval) {
    var latest = {};
    $scope.refresh = function() {
      $http.get("https://groovymarty.com/gvyhome/data/latest")
        .then(res => {
          latest = res.data.latest;
          var inp = latest.ma1.inp || 0;
          $scope.h_wh = inp & 1;
          $scope.h_mbr = inp & 2;
          $scope.h_1st = inp & 4;
          $scope.h_2nd = inp & 8;
          $scope.boil = inp & 16;
          $scope.c_mbr = inp & 32;
          $scope.c_1st = inp & 64;
          $scope.c_2nd = inp & 128;
          $scope.well = inp & 256;
          $scope.hw_pump = inp & 512;
          $scope.hstat_br = inp & 1024;
          $scope.hstat_lr = inp & 2048;
          $scope.pel_on = inp & 4096;
          $scope.weather = latest.ow1;
        })
        .catch(err => {
          console.log("failed to get latest", err);
        });
    };
    $scope.refresh();
    var refreshTimer = $interval($scope.refresh, 10000);
    $scope.$on('$destroy', function() {
      $interval.cancel(refreshTimer);
    });
  }
]);
