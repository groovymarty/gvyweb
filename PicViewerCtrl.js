angular.module('gvyweb').controller('PicViewerCtrl', [
  '$scope', '$stateParams', '$state', 'gvypics',
  function($scope, $stateParams, $state, gvypics) {
    var placeholder = {
      isPlaceholder: true,
      id: "",
      folders: [],
      pictures: [],
      videos: []      
    };
    $scope.curId = null;
    $scope.nextId = null;
    $scope.prevId = null;
    $scope.curFold = placeholder;
    
    function setCurId(id) {
      var i = $scope.curFold.pictures.indexOf(id);
      if (i < 0) {
        i = parseInt($stateParams.i);
        id = $scope.curFold.pictures[i];
        if (!id) {
          i = 0;
          id = $scope.curFold.pictures[0];
        }
      }
      $scope.curId = id;
      $scope.nextId = $scope.curFold.pictures[i+1];
      $scope.prevId = $scope.curFold.pictures[i-1];
    }

    gvypics.getFolder($stateParams.id).then(function(folder) {
      $scope.curFold = folder;
      setCurId($stateParams.id);
    }).catch(function(err) {
      console.log(err.message);
    });
    
    function isFullScreen() {
      return document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement;
    }
    
    function requestFullScreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    function exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    function makeGoParams(id) {
      var i = $scope.curFold.pictures.indexOf(id);
      if (i < $scope.curFold.numNativePics) {
        return {id: id};
      } else {
        return {id: $scope.curFold.id, i: i};
      }
    }

    $scope.clickPic = function() {
      if (!isFullScreen()) {
        var elem = document.getElementById('viewer');
        if (elem) {
          requestFullScreen(elem);
        }
      } else {
        exitFullScreen();
        $state.go('picviewer', makeGoParams($scope.curId));
      }
    };
    
    $scope.doPrev = function() {
      if ($scope.prevId) {
        if (isFullScreen()) {
          setCurId($scope.prevId);
        } else {
          $state.go('picviewer', makeGoParams($scope.prevId));
        }
      }
    };
    
    $scope.doNext = function() {
      if ($scope.nextId) {
        if (isFullScreen()) {
          setCurId($scope.nextId);
        } else {
          $state.go('picviewer', makeGoParams($scope.nextId));
        }
      }
    };
    
    $scope.doClose = function() {
      $state.go('picbrowser', makeGoParams($scope.curId));
    };
  }
]);
