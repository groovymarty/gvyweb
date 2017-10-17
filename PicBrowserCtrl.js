angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', 'gvypics', '$window', '$timeout',
  function($scope, $stateParams, gvypics, $window, $timeout) {
    var moreBump;
    $scope.toggleTileSz = function(newSz) {
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
    $scope.toggleTileSz($stateParams.sz);
    $scope.morePics = function() {
      $scope.nlimit += moreBump;
    };

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
 
    $scope.showVideo = false;
    $scope.toggleVideo = function() {
      $scope.showVideo = !$scope.showVideo;
    };

    $scope.showCarousel = false;
    $scope.curIndex = 0;
    $scope.startIndex = 0;
    $scope.endIndex = 0;
    var nPrefetch = 2;

    function setCarouselSize() {
      var h = $window.innerHeight;
      var w = $window.innerWidth;
      console.log("setting "+w+"x"+h);
      document.getElementById("carousel").style.height = h + "px";
      document.getElementById("carousel").style.width = w + "px";
    }
    
    function updateCarouselRange() {
      var iStart = $scope.curIndex - nPrefetch;
      if (iStart < 0) {
        iStart = 0;
      }
      if (iStart < $scope.startIndex) {
        $scope.startIndex = iStart;
      }
      var iEnd = $scope.curIndex + nPrefetch;
      if (iEnd > $scope.cur.pictures.length) {
        iEnd = $scope.cur.pictures.length;
      }
      if (iEnd > $scope.endIndex) {
        $scope.endIndex = iEnd;
      }
    }

    $scope.toggleCarousel = function(id) {
      $scope.showCarousel = !$scope.showCarousel;
      if ($scope.showCarousel) {
        $scope.curIndex = $scope.cur.pictures.indexOf(id) || 0;
        updateCarouselRange();
        setCarouselSize();
      }
    };
    angular.element($window).on('resize', function() {
      if ($scope.showCarousel) {
        $timeout(setCarouselSize, 10);
      }
    });
    $scope.$watch('curIndex', updateCarouselRange);
    
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
