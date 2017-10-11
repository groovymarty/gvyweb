angular.module('gvyweb').controller('PicViewerCtrl', [
  '$scope', '$stateParams', 'gvypics',
  function($scope, $stateParams, gvypics) {
    var placeholder = {
      isPlaceholder: true,
      id: "",
      folders: [],
      pictures: [],
      videos: []      
    };
    $scope.id = $stateParams.id;
    $scope.cur = placeholder;

    gvypics.getFolder($stateParams.id).then(function(folder) {
      $scope.cur = folder;
    }).catch(function(err) {
      console.log(err.message);
    });
  }
]);
