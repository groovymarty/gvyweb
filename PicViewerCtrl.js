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
    $scope.curId = $stateParams.id;
    $scope.nextId = null;
    $scope.prevId = null;
    $scope.curFold = placeholder;
    
    function setCurId(id) {
      $scope.curId = id;
      var i = $scope.curFold.pictures.indexOf(id);
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
      return document.fullScreenElement || document.mozFullScreenElement ||
        document.webkitFullScreenElement || document.msFullScreenElement;
    }
    
    function requestFullScreen(elem) {
      if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
      } else if (elem.msRequestFullScreen) {
        elem.msRequestFullScreen();
      }
    }

    $scope.clickPic = function() {
      if (!isFullScreen()) {
        var elem = document.getElementById('viewer');
        if (elem) {
          requestFullScreen(elem);
        }
      }
    };
    
    $scope.doPrev = function() {
      if ($scope.prevId) {
        setCurId($scope.prevId);
      }
    };
    
    $scope.doNext = function() {
      if ($scope.nextId) {
        setCurId($scope.nextId);
      }
    };
    
    $scope.doClose = function() {
      $state.go('picbrowser', {id: $scope.curId});
    };
  }
]);
