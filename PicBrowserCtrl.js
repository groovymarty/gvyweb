angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', 'gvypics', '$window', '$timeout',
  function($scope, $stateParams, gvypics, $window, $timeout) {
    $scope.sz = $stateParams.sz || "sm";
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
    var moreBump = ($scope.sz == "sm") ? 100 : 20;
    $scope.nlimit = moreBump;
    $scope.morePics = function() {
      $scope.nlimit += moreBump;
    };
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

    // get specified folder and insert at beginning of path
    // continue recursively until root folder reached
    function buildPath(id) {
      return gvypics.getFolder(id).then(function(folder) {
        if ($scope.cur.isPlaceholder) {
          $scope.cur = folder;
        }
        if (folder.id === "") {
          $scope.root = folder;
          return true; //done
        } else {
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
