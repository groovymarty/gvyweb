angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', 'gvypics', '$window', '$timeout',
  function($scope, $stateParams, gvypics, $window, $timeout) {
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
    $scope.nlimit = 100;
    $scope.morePics = function() {
      $scope.nlimit += 100;
    };
    $scope.showVideo = false;
    $scope.toggleVideo = function() {
      $scope.showVideo = !$scope.showVideo;
    };
    $scope.showCarousel = false;
    $scope.curIndex = 0;

    function setCarouselSize() {
      console.log("setting "+$window.screen.availWidth+" x "+$window.screen.availHeight);
      document.getElementById("carousel").style.height = $window.screen.availHeight + "px";
      document.getElementById("carousel").style.width = $window.screen.availWidth + "px";
    }
    $scope.toggleCarousel = function(id) {
      $scope.showCarousel = !$scope.showCarousel;
      if ($scope.showCarousel) {
        $scope.curIndex = $scope.cur.pictures.indexOf(id) || 0;
        setCarouselSize();
      }
    };
    angular.element($window).on('resize', function() {
      if ($scope.showCarousel) {
        $timeout(setCarouselSize, 10);
      }
    });

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
