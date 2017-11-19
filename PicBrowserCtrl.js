angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', '$state', '$timeout', 'gvypics',
  function($scope, $stateParams, $state, $timeout, gvypics) {
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
    $scope.curFold = placeholder;
    var curPicId = null;
    var moreBump;
    var fixScrollTimer = null;
    
    console.log("hello from PicBrowerCtrl");

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

    // get specified folder and insert at beginning of path
    // continue recursively until root folder reached
    function buildPath(id) {
      return gvypics.getFolder(id).then(function(folder) {
        if ($scope.curFold.isPlaceholder) {
          $scope.curFold = folder;
        }
        if (folder.id === "") {
          if ($scope.firstlevel) {
            $scope.firstlevel.parentFolder = folder;
          }
          $scope.root = folder;
          pickNextFolder($scope.curFold);
          setCurPic($stateParams.id);
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

    // pick target for "next" button
    function pickNextFolder(fold) {
      if (fold.folders.length) {
        // Pick first child, but not if we're at root
        if (fold.id !== "") {
          $scope.nextId = fold.folders[0];
        }
      } else {
        pickNextSibling(fold);
      }
    }
    function pickNextSibling(fold) {
      if (fold.parentFolder) {
        var i = fold.parentFolder.folders.indexOf(fold.id) + 1;
        if (i < fold.parentFolder.folders.length) {
          $scope.nextId = fold.parentFolder.folders[i];
        } else {
          pickNextSibling(fold.parentFolder);
        }
      }
    }
    
    // pick current picture
    function setCurPic(id) {
      var i = $scope.curFold.pictures.indexOf(id);
      if (i >= 0) {
        curPicId = id;
        console.log("curPicId is "+curPicId);
        if (i >= $scope.nlimit) {
          var moreNeeded = i - $scope.nlimit + 1;
          $scope.nlimit += Math.ceil(moreNeeded / moreBump) * moreBump;
          console.log("bumping nlimit to "+$scope.nlimit);
        }
        $scope.$applyAsync(function() {
          fixScroll(10);
        });
      }
    }
    
    function fixScroll(retries) {
      if (curPicId) {
        console.log("searching for "+curPicId);
        elem = document.getElementById(curPicId);
        if (elem) {
          console.log("found");
          elem.scrollIntoView();
          cancelFixScrollTimer();
        } else if (retries && !fixScrollTimer) {
          fixScrollTimer = $timeout(function() {
            fixScroll(retries-1);
          }, 200);
        }
      }
    }
    
    function cancelFixScrollTimer() {
      if (fixScrollTimer) {
        $timeout.cancel(fixScrollTimer);
        fixScrollTimer = null;
      }
    }
    
    $scope.$on('$destroy', function() {
      cancelFixScrollTimer();
    });
  }
]);
