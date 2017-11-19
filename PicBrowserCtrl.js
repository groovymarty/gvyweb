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
    var curPic = null;
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
        $scope.$applyAsync(fixScrollReset);
      }
    };
    $scope.rotateTileSz($stateParams.sz);
    
    $scope.clickPic = function(id) {
      setCurPic(id);
      if ($scope.sz !== "md") {
        $scope.rotateTileSz();
      } else {
        $state.go('picviewer', {id: id});
      }
      fixScrollReset();
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
          $scope.$applyAsync(initCurPic);
        } else {
          setCurPic(id);
          if (curPic) {
            fixScrollReset();
          } else {
            startScrollTimer(initCurPic, 200);
          }
        }
      }
    }
    
    function setCurPic(id) {
      if (curPic) {
        angular.element(curPic).removeClass('current');
      }
      if (id) {
        curPic = document.getElementById(id);
        if (curPic) {
          angular.element(curPic).addClass('current');
        }
      }
    }
    
    function isInView(elem) {
      var top = elem.getBoundingClientRect().top;
      var bottom = elem.getBoundingClientRect().bottom;
      var wHeight = window.innerHeight;
      // true if top of element is in view, and bottom also in view if possible
      return top >= 0 && top < wHeight && (bottom < wHeight || top < 1);
    }
    
    function fixScrollReset() {
      if (curPic) {
        inViewCount = 0;
        userScroll = false;
        fixScroll();
      }
    }
    
    function fixScroll() {
      if (curPic) {
        if (!isInView(curPic)) {
          //console.log("not in view");
          inViewCount = 0;
          userScroll = false;
          curPic.scrollIntoView();
        } else {
          inViewCount += 1;
          //console.log("in view "+inViewCount);
          if (inViewCount >= 2) {
            userScroll = true;
          }
        }
        startScrollTimer(fixScroll, 500);
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
      var delta = scrollY - lastScrollY;
      if (userScroll) {
        if (delta < -10 || delta > 10) {
          cancelScrollTimer();
          lastScrollY = scrollY;
        }
      } else {
        lastScrollY = scrollY;
      }
    });
  }
]);
