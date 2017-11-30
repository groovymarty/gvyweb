angular.module('gvyweb').controller('PicViewerCtrl', [
  '$scope', '$stateParams', '$state', '$timeout', 'gvypics',
  function($scope, $stateParams, $state, $timeout, gvypics) {
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
    var image = null;
    
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

    var enableClickPic = true;
    $scope.clickPic = function() {
      if (!enableClickPic) {
        //ignore
      } else if (isTransformed()) {
        resetTransforms();
      } else if (!isFullScreen()) {
        requestFullScreen(viewer);
      } else {
        //exitFullScreen();
        //$state.go('picviewer', makeGoParams($scope.curId), {reload: true});
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
    
    var mc = new Hammer.Manager(viewer);
    var swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL});
    var press = new Hammer.Press({time: 500});
    mc.add([swipe, press]);
    
    mc.on("swipeleft", function() {
      $scope.doNext();
    });
  
    mc.on("swiperight", function() {
      $scope.doPrev();
    });
    
    mc.on("press", function() {
      enableClickPic = false; //avoid interference with click handler
      resetTransforms();
      exitFullScreen();
      $timeout(function() { //sometimes no pressup event when we exit full screen
        enableClickPic = true;
      }, 2000);
    });
    
    mc.on("pressup", function() {
      enableClickPic = true;
    });
    
    // see https://gist.github.com/synthecypher/f778e4f5a559268a874e for pan-zoom-image.js
    
    var adjustScale = 1;
    var adjustDeltaX = 0;
    var adjustDeltaY = 0;
    
    var currentScale = 1;
    var currentDeltaX = 0;
    var currentDeltaY = 0;
          
    var pinch = new Hammer.Pinch();
    var pan = new Hammer.Pan();
    pinch.recognizeWith(pan);
    swipe.recognizeWith(pan);
    mc.add([pinch, pan]);
          
    // Handles pinch and pan events/transforming at the same time
    mc.on("pinch pan", function (ev) { 
      // Adjusting the current pinch/pan event properties using the previous ones set when they finished touching
      currentScale = adjustScale * ev.scale;
      currentDeltaX = adjustDeltaX + (ev.deltaX / currentScale);
      currentDeltaY = adjustDeltaY + (ev.deltaY / currentScale);
      
      // if pinched smaller than original, snap back to original
      // also no panning unless scaled larger than original
      if (currentScale <= 1) {
        resetTransforms();
      } else {
        // Concatinating and applying parameters.
        var transforms = [];
        transforms.push("scale("+currentScale+")");
        transforms.push("translate("+currentDeltaX+"px,"+currentDeltaY+"px)");
        if (!image) {
          image = document.getElementById("viewer-img");
        }
        if (image) {
          image.style.transform = transforms.join(" ");
        }
      }
    });

    mc.on("panend pinchend", function () {  
      // Saving the final transforms for adjustment next time the user interacts.
      adjustScale = currentScale;
      adjustDeltaX = currentDeltaX;
      adjustDeltaY = currentDeltaY;
    });
    
    function isTransformed() {
      return currentScale !== 1 || currentDeltaX || currentDeltaY;
    }
    
    function resetTransforms() {
      currentScale = adjustScale = 1;
      currentDeltaX = adjustDeltaX = 0;
      currentDeltaY = adjustDeltaY = 0;
      if (image) {
        image.style.transform = "";
      }
    }
  }
]);
