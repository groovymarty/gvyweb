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
    $scope.nextId = null;
    $scope.prevId = null;
    $scope.cur = placeholder;

    gvypics.getFolder($stateParams.id).then(function(folder) {
      $scope.cur = folder;
      var i = folder.pictures.indexOf($stateParams.id);
      $scope.nextId = folder.pictures[i+1];
      $scope.prevId = folder.pictures[i-1];
    }).catch(function(err) {
      console.log(err.message);
    });
  }
]);
