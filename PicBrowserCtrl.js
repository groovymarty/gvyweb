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
    $scope.nlimit = 0;
    var curPic = null; //DOM pic-tile element
    var moreBump;
    var scrollTimer = null;
    var lastScrollY = 0;
    var userScroll = false;
    var inViewCount = 0;
    
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
      if ($scope.nlimit < moreBump) {
        $scope.nlimit = moreBump;
      }
      $stateParams.sz = $scope.sz;
      if (curPic) {
        $scope.$applyAsync(setSticky);
      }
    };
    $scope.rotateTileSz($stateParams.sz);
    
    $scope.clickPic = function(id) {
      /*
      setCurPic(id);
      if ($scope.sz !== "md") {
        $scope.rotateTileSz();
      } else {
        $state.go('picviewer', {id: id});
      }
      setSticky();
      */
      $state.go('picviewer', {id: id});
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
          initCurPic();
        }
        if (folder.id === "") {
          if ($scope.firstlevel) {
            $scope.firstlevel.parentFolder = folder;
          }
          $scope.root = folder;
          pickNextFolder($scope.curFold);
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
    
    function initCurPic() {
      var id = $stateParams.id;
      var i = $scope.curFold.pictures.indexOf(id);
      if (i >= 0) {
        if (i >= $scope.nlimit) {
          var moreNeeded = i - $scope.nlimit + 1;
          $scope.nlimit += Math.ceil(moreNeeded / 20) * 20;
          //console.log("bumping nlimit to "+$scope.nlimit);
          // give angular a chance to respond to nlimit change then try again
          $scope.$applyAsync(initCurPic);
        } else {
          setCurPic(id);
          if (curPic) {
            setSticky();
          } else {
            startScrollTimer(initCurPic, 200);
          }
        }
      }
    }
    
    function setCurPic(id) {
      if (curPic) {
        angular.element(curPic).removeClass('current sticky');
      }
      if (id) {
        curPic = document.getElementById(id);
        if (curPic) {
          angular.element(curPic).addClass('current');
        }
      }
    }
    
    function isInView(elem, state) {
      var top = elem.getBoundingClientRect().top;
      var bottom = elem.getBoundingClientRect().bottom;
      var wHeight = window.innerHeight;
      var result = false;
      var partial = false;
      if (top < 0) {
        if (bottom >= 0) {
          // top edge is above but bottom is in view
          // declare in view if at least 50% of screen covered
          partial = true;
          result = bottom*2 >= wHeight || (state && state.forceNext);
        }
      } else if (top < wHeight) {
        // top edge is in view
        // declare in view if bottom edge also in view or at least 50% of screen covered
        if (bottom < wHeight) {
          result = true;
        } else {
          partial = true;
          result = top*2 < wHeight || (state && state.forceNext);
        }
      }
      // if partially in view but not not enough, force next one to be in view
      if (state) {
        state.forceNext = partial && !result;
      }
      return result;
    }
    
    function findInView() {
      if (!curPic || !isInView(curPic)) {
        var inViewState = {};
        if (!$scope.curFold.pictures.some(function(id) {
          var elem = document.getElementById(id);
          if (elem && isInView(elem, inViewState)) {
            setCurPic(id);
            return true;
          } else {
            return false;
          }
        })) {
          console.log("can't find picture in view");
        }
      }
    }
    
    function setSticky() {
      if (curPic) {
        angular.element(curPic).addClass('sticky');
        inViewCount = 0;
        userScroll = false;
        fixScroll();
      }
    }
    
    function clearSticky() {
      if (curPic) {
        angular.element(curPic).removeClass('sticky');
        userScroll = true;
        cancelScrollTimer();
      }
    }
    
    function fixScroll() {
      if (curPic) {
        if (!isInView(curPic)) {
          //console.log("not in view");
          inViewCount = 0;
          userScroll = false;
          curPic.scrollIntoView();
          startScrollTimer(fixScroll, 500);
        } else {
          inViewCount += 1;
          //console.log("in view "+inViewCount);
          if (inViewCount >= 2) {
            clearSticky();
          } else {
            startScrollTimer(fixScroll, 500);
          }
        }
      }
    }
    
    function startScrollTimer(f, t) {
      cancelScrollTimer();
      scrollTimer = $timeout(f, t);
    }
    
    function cancelScrollTimer() {
      if (scrollTimer) {
        $timeout.cancel(scrollTimer);
        scrollTimer = null;
      }
    }
    
    $scope.$on('$destroy', function() {
      cancelScrollTimer();
    });
    
    angular.element(window).on('scroll', function() {
      var scrollY = window.scrollY;
      if (userScroll) {
        //var delta = scrollY - lastScrollY;
        $scope.$applyAsync(findInView);
      }
      lastScrollY = scrollY;
    });
    
    angular.element(window).on('resize', function() {
      setSticky();
    });
    
    angular.element(window).on('orientationchange', function() {
      setSticky();
    });
  }
]);
