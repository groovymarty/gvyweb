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
    var viewer = document.getElementById('viewer');
    var image = document.getElementById('viewer-img');
    
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
        if (viewer) {
          requestFullScreen(viewer);
        }
      } else {
        //exitFullScreen();
        //$state.go('picviewer', makeGoParams($scope.curId), {reload: true});
        resetTransforms();
      }
    };
    
    $scope.doPrev = function() {
      if ($scope.prevId) {
        if (isFullScreen()) {
          setCurId($scope.prevId);
          resetTransforms();
        } else {
          $state.go('picviewer', makeGoParams($scope.prevId));
        }
      }
    };
    
    $scope.doNext = function() {
      if ($scope.nextId) {
        if (isFullScreen()) {
          setCurId($scope.nextId);
          resetTransforms();
        } else {
          $state.go('picviewer', makeGoParams($scope.nextId));
        }
      }
    };
    
    $scope.doClose = function() {
      $state.go('picbrowser', makeGoParams($scope.curId));
    };

    var mc = new Hammer.Manager(image);
    var pinch = new Hammer.Pinch();
    var pan = new Hammer.Pan();
  
    pinch.recognizeWith(pan);
    mc.add([pinch, pan]);
  
    var adjustScale = 1;
    var adjustDeltaX = 0;
    var adjustDeltaY = 0;
    
    var currentScale = null;
    var currentDeltaX = null;
    var currentDeltaY = null;
    
    // Handles pinch and pan events/transforming at the same time
    mc.on("pinch pan", function (ev) { 
      var transforms = [];

      // Adjusting the current pinch/pan event properties using the previous ones set when they finished touching
      currentScale = adjustScale * ev.scale;
      currentDeltaX = adjustDeltaX + (ev.deltaX / currentScale);
      currentDeltaY = adjustDeltaY + (ev.deltaY / currentScale);

      // Concatinating and applying parameters.
      transforms.push("scale("+currentScale+")");
      transforms.push("translate("+currentDeltaX+"px,"+currentDeltaY+"px)");
      image.style.transform = transforms.join(" ");
    });

    mc.on("panend pinchend", function () {  
      // Saving the final transforms for adjustment next time the user interacts.
      adjustScale = currentScale;
      adjustDeltaX = currentDeltaX;
      adjustDeltaY = currentDeltaY;
    });
    
    function resetTransforms() {
      adjustScale = 1;
      adjustDeltaX = 0;
      adjustDeltaY = 0;
      image.style.transform = "";
    }
  }
]);
