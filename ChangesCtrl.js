angular.module('gvyweb').controller('ChangesCtrl', [
  '$scope', 'metaChg',
  function($scope, metaChg) {
    $scope.metaChg = metaChg;
  }
]);
