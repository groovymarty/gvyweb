angular.module('gvyweb').controller('HomeCtrl', [
  '$scope', 'gvypics', 'alert',
  function($scope, gvypics, alert) {
    $scope.gvypics = gvypics;
  }
]);
