angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', '$state', 'gvypics',
  function($scope, $stateParams, $state, gvypics) {
    var placeholder = {
      isPlaceholder: true,
      id: "",
      folders: [],
      pictures: [],
      videos: []      
    };
    $scope.root = placeholder;
    $scope.firstlevel = placeholder;
    $scope.path = [];
    $scope.cur = placeholder;
    var moreBump;

    $scope.rotateTileSz = function(newSz) {
      $scope.sz = newSz || (($scope.sz === "sm") ? "md" : "sm");
      switch ($scope.sz) {
        case "sm":
          moreBump = 100;
          $scope.tileSzBtnText = "Large Tiles";
          break;
        case "md":
          moreBump = 20;
          $scope.tileSzBtnText = "Small Tiles";
          break;
      }
      $scope.nlimit = moreBump;
      $stateParams.sz = $scope.sz;
    };
    $scope.rotateTileSz($stateParams.sz);
    
    $scope.clickPic = function(id) {
      if ($scope.sz !== "md") {
        $scope.rotateTileSz();
      } else {
        $state.go('picviewer', {id: id});
      }
    };

    $scope.morePics = function() {
      $scope.nlimit += moreBump;
    };
 
    $scope.showVideo = false;
    $scope.toggleVideo = function() {
      $scope.showVideo = !$scope.showVideo;
    };

    // pick target for "next" button
    function pickNextSibling(cur) {
      if (cur.parentFolder) {
        var i = cur.parentFolder.folders.indexOf(cur.id) + 1;
        if (i < cur.parentFolder.folders.length) {
          $scope.nextId = cur.parentFolder.folders[i];
        } else {
          pickNextSibling(cur.parentFolder);
        }
      }
    }
    function pickNext(cur) {
      if (cur.folders.length) {
        // Pick first child, but not if we're at root
        if (cur.id !== "") {
          $scope.nextId = $scope.cur.folders[0];
        }
      } else {
        pickNextSibling(cur);
      }
    }

    // get specified folder and insert at beginning of path
    // continue recursively until root folder reached
    function buildPath(id) {
      return gvypics.getFolder(id).then(function(folder) {
        if ($scope.cur.isPlaceholder) {
          $scope.cur = folder;
        }
        if (folder.id === "") {
          if ($scope.firstlevel) {
            $scope.firstlevel.parentFolder = folder;
          }
          $scope.root = folder;
          pickNext($scope.cur);
          return true; //done
        } else {
          if ($scope.path[0]) {
            $scope.path[0].parentFolder = folder;
          }
          if (folder.parent === "") {
            $scope.firstlevel = folder;
          } else {
            $scope.path.unshift(folder);
          }
          return buildPath(folder.parent);
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    }
    buildPath($stateParams.id);
  }
]);
