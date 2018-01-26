angular.module('gvyweb').controller('PicViewerCtrl', [
  '$scope', '$stateParams', '$state', '$timeout', 'gvypics', 'alert', 'appSettings', 'rating', 'metaChg', 'fold',
  function($scope, $stateParams, $state, $timeout, gvypics, alert, appSettings, rating, metaChg, fold) {
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
    $scope.prefetchId = null;
    var direction = 1;
    $scope.tooFar = false;
    $scope.loading = false;
    $scope.menuIsOpen = false;
    $scope.curFold = placeholder;
    $scope.appSettings = appSettings;
    $scope.rating = rating;
    $scope.gvypics = gvypics;
    $scope.capText = {};
    $scope.showCapEdit = false;
    var viewer = document.getElementById('viewer');
    var image = null;
    var buttons = ['viewer-menu', 'viewer-close', 'viewer-prev', 'viewer-next'].map(function(id) {
      return document.getElementById(id);
    });
    var buttonOutTimer = null;
    var caption = document.getElementById('viewer-caption');
    var buttonsVisible = true;
    var captionShown = true;
    
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
      $scope.nextId = findNextId(i);
      $scope.prevId = findNextId(i, -1);
      setTooFar(false);
      waitForImage(function() {
        // add handler before we check image.complete
        image.onload = function() {
          // image is loaded, clear loading flag and trigger digest cycle
          $scope.$apply(function() {
            $scope.loading = false;
            $scope.prefetchId = (direction > 0) ? $scope.nextId : $scope.prevId;
          });
        };
        // update current loading status
        $scope.loading = !image.complete;        
      });
    }
 
    // find ID of next picture in specified direction (1 or -1)   
    function findNextId(i, direction) {
      var dir = direction || 1;
      if (!appSettings.ratingFilter) {
        // no filtering, all pictures are displayed
        return $scope.curFold.pictures[i+dir];
      } else {
        var meta = $scope.curFold.meta || {};
        var id;
        while ((id = $scope.curFold.pictures[i += dir]) && true) { //avoid assignment stmt warning
          var level = (meta[id] && meta[id].rating) || 0;
          if (rating.filterHas(appSettings.ratingFilter, level)) {
            break;
          }
        }
        return id;
      }
    }

    // delay one or more digest cycles for ng-if to create the image element
    // then execute specified function
    function waitForImage(f, maxLoops) {
      if (typeof maxLoops === 'undefined') {
        maxLoops = 10;
      }
      $timeout(function() {
        if (getImage()) {
          f();
        } else if (!maxLoops) {
          console.log("waitForImage giving up!");        
        } else {
          waitForImage(f, maxLoops-1);
        }
      });
    }

    // set tooFar flag to specified value
    // when true, the red "stop" icon appears on the screen and then fades out
    function setTooFar(val) {
      if (val && $scope.tooFar) {
        // already true, set false briefly to restart animation
        $scope.tooFar = false;
        $timeout(function() {
          $scope.tooFar = true;
        });
      } else {
        $scope.tooFar = val;
      }
    }

    // image element is not created until ng-if sees curId has been set    
    function getImage() {
      if (!image) {
        image = document.getElementById("viewer-img");
      }
      return image;
    }
    
    gvypics.getFolder($stateParams.id).then(function(folder) {
      $scope.curFold = folder;
      $scope.capText = fold.buildCapText(folder, appSettings.showId);
      setCurId($stateParams.id);
      buttonOutReset();
    }).catch(function(err) {
      alert.addAlert(err.message);
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
      if (!enableClickPic || $scope.menuIsOpen) {
        //ignore
      } else if (isTransformed()) {
        resetTransforms();
      } else if (!isFullScreen()) {
        requestFullScreen(viewer);
      } else if (!buttonsVisible && captionShown) {
        // cycle (second click): buttons off, captions on -> both off
        showCaption(false);
      } else {
        showCaption(true);
        if (!buttonsVisible) {
          // cycle (third click): both off ->both on
          buttonOutReset();
        } else {
          // cycle (first click): both on -> buttons off, captions on
          setButtonOutNoFade();
        }
      }
    };
    
    $scope.prevClick = function() {
      buttonOutReset();
      doPrev();
    };
  
    function doPrev(fsRequested) {
      direction = -1;
      if ($scope.prevId) {
        if (isFullScreen() || fsRequested) {
          setCurId($scope.prevId);
          resetTransforms();
        } else {
          $state.go('picviewer', makeGoParams($scope.prevId));
        }
      }
    }
    
    $scope.nextClick = function() {
      buttonOutReset();
      doNext();
    };
    
    function doNext(fsRequested) {
      direction = 1;
      if ($scope.nextId) {
        if (isFullScreen() || fsRequested) {
          setCurId($scope.nextId);
          resetTransforms();
        } else {
          $state.go('picviewer', makeGoParams($scope.nextId));
        }
      }
    }
    
    $scope.doClose = function() {
      $state.go('picbrowser', makeGoParams($scope.curId));
    };
    
    function showCaption(show) {
      angular.element(caption).toggleClass("caption-out", !show);
      captionShown = show;
    }
    
    function buttonOutReset() {
      // redisplay the buttons
      buttons.forEach(function(elem) {
        angular.element(elem).removeClass("btn-out btn-out-out btn-out-out-out");
      });
      buttonsVisible = true;
      // start inactivity timer
      cancelButtonOutTimer();
      buttonOutTimer = $timeout(setButtonOut, 2000);
    }
    
    function setButtonOut() {
      // start fadeout using CSS animation
      buttons.forEach(function(elem) {
        angular.element(elem).addClass("btn-out btn-out-out");
      });
      // start fadeout timer
      cancelButtonOutTimer();
      buttonOutTimer = $timeout(function() {
        // animation is finished, buttons now out
        buttonsVisible = false;
      }, 1000);
    }
    
    function setButtonOutNoFade() {
      // no fadeout
      buttons.forEach(function(elem) {
        angular.element(elem).addClass("btn-out btn-out-out btn-out-out-out");
      });
      buttonsVisible = false;
      cancelButtonOutTimer();
    }
    
    function cancelButtonOutTimer() {
      if (buttonOutTimer) {
        $timeout.cancel(buttonOutTimer);
        buttonOutTimer = null;
      }
    }
    
    $scope.$on('$destroy', function() {
      cancelButtonOutTimer();
    });

    var mc = new Hammer.Manager(viewer);
    var swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_ALL});
    var press = new Hammer.Press({time: 500});
    mc.add([swipe, press]);
    
    mc.on("swipeleft", function() {
      if (!isFullScreen()) {
        requestFullScreen(viewer);
      }
      if ($scope.nextId) {
        doNext(true);
      } else {
        setTooFar(true);
      }
      $scope.$apply(); //to reload image if full screen
    });
  
    mc.on("swiperight", function() {
      if (!isFullScreen()) {
        requestFullScreen(viewer);
      }
      if ($scope.prevId) {
        doPrev(true);
      } else {
        setTooFar(true);
      }
      $scope.$apply(); //to reload image if full screen
    });
    
    mc.on("swipeup", function() {
      $scope.doClose();
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
    // pan and swipe are incompatible, even with recognizeWith
    // keep pan disabled until user scales picture larger, then enable pan and disable swipe
    pan.set({enable: false});
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
        // picture has been scaled larger, enable pan and disable swipe
        swipe.set({enable: false});
        pan.set({enable: true});
        // apply transformations
        var transforms = [];
        transforms.push("scale("+currentScale+")");
        transforms.push("translate("+currentDeltaX+"px,"+currentDeltaY+"px)");
        if (getImage()) {
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
      swipe.set({enable: true});
      pan.set({enable: false});
      currentScale = adjustScale = 1;
      currentDeltaX = adjustDeltaX = 0;
      currentDeltaY = adjustDeltaY = 0;
      if (image) {
        image.style.transform = "";
      }
    }
    
    $scope.setRating = function(level) {
      var meta = $scope.curFold.meta;
      if (!meta[$scope.curId]) {
        meta[$scope.curId] = {};
      }
      meta[$scope.curId].rating = level;
      metaChg.addChange($scope.curId, {rating: level});
      if (!appSettings.showRating) {
        appSettings.showRating = true;
        appSettings.ratingFilter = 0;
      }
    };
    
    $scope.openCapEdit = function() {
      var id = $scope.curId;
      $scope.capEditText = ($scope.curFold.meta[id] && $scope.curFold.meta[id].caption) || "";
      $scope.showCapEdit = true;
    };
    
    $scope.closeCapEdit = function(apply) {
      if (apply) {
        var id = $scope.curId;
        if (!$scope.curFold.meta[id]) {
          $scope.curFold.meta[id] = {};
        }
        $scope.curFold.meta[id].caption = $scope.capEditText;
        metaChg.addChange(id, {caption: $scope.capEditText});
        $scope.capText = fold.buildCapText($scope.curFold, appSettings.showId);
      }
      $scope.showCapEdit = false;
    };
  }
]);
