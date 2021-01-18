angular.module('gvyweb').controller('HouseCtrl', ['$scope', '$http', function($scope, $http) {
  var latest = {};
  $scope.refresh = function() {
    $http.get("https://groovymarty.com/gvyhome/data/latest")
      .then(res => {
        latest = res.data;
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
        $scope.weather = latest.ow1;
      })
      .catch(err => {
        console.log("failed to get latest", err);
      });
  };
  $scope.refresh();
}]);
