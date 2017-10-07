angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', 'gvypics',
  function($scope, $stateParams, gvypics) {
    $scope.path = [];
    $scope.cur = { //replace with real folder as soon as we can
      isPlaceholder: true,
      folders: [],
      pictures: [],
      videos: []
    };
    function buildPath(id) {
      return gvypics.getFolder(id).then(function(folder) {
        if ($scope.cur.isPlaceholder) {
          $scope.cur = folder;
        }
        $scope.path.unshift(folder);
        if (folder.id !== "") {
          return buildPath(folder.parent);
        } else {
          return true; //done
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    }
    buildPath($stateParams.id);
  }
]);
