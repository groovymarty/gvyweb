angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', '$state', '$timeout', 'gvypics', 'alert', 'appSettings', 'rating',
  function($scope, $stateParams, $state, $timeout, gvypics, alert, appSettings, rating) {
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
    $scope.istart = 0;
    $scope.nlimit = 0;
    var curPic = null; //DOM pic-tile element
    var curPicId = null;
    var moreBump;
    var scrollTimer = null;
    var lastScrollY = 0;
    var userScroll = false;
    var inViewCount = 0;
    
    $scope.contextMenuOptions = [{
      text: function() {
        return $scope.tileSzOptionText;
      },
      click: function($itemScope) {
        setCurPic($itemScope.id);
        setSticky();
        $scope.rotateTileSz();
      }
    },{
      text: function() {
        return $scope.ratingsOptionText;
      },
      click: function() {
        $scope.toggleRatings();
      }
    },{
      text: "Download",
      children: [{
        text: "Small",
        click: function($itemScope) {
          doDownload($itemScope.id, "sm");
        }
      },{
        text: "Medium",
        click: function($itemScope) {
          doDownload($itemScope.id, "md");
        }
      },{
        text: "Large",
        click: function($itemScope) {
          doDownload($itemScope.id, "lg");
        }
      },{
        text: "Full resolution",
        click: function($itemScope) {
          doDownload($itemScope.id, "");
        }
      }]
    },{
      text: "Set Rating",
      displayed: function() {return gvypics.userId;},
      hasTopDivider: true,
      children: [5, 4, 3, 2, 1].map(function(r) {
        return {
          text: rating.iconHtml[r] + " " + rating.description[r] + " (" + r + ")",
          click: function($itemScope) {
            setRating($itemScope.$parent, $itemScope.id, r);
          }
        };
      })
    }];
    
    $scope.rotateTileSz = function(newSz) {
      $scope.sz = newSz || (($scope.sz === "sm") ? "md" : "sm");
      switch ($scope.sz) {
        case "sm":
          moreBump = 100;
          $scope.tileSzOptionText = "Large Tiles";
          break;
        case "md":
          moreBump = 20;
          $scope.tileSzOptionText = "Small Tiles";
          break;
      }

      // reset range to include current picture
      var i = $scope.curFold.pictures.indexOf(curPicId);
      if (i < 0) {
        i = 0;
      }
      $scope.istart = Math.floor(i / moreBump) * moreBump;
      $scope.nlimit = moreBump;
      appSettings.tileSize = $scope.sz;
      if (curPic) {
        $scope.$applyAsync(setSticky);
      }
    };
    $scope.rotateTileSz($stateParams.sz || appSettings.tileSize);
    
    $scope.toggleRatings = function(newShowRating) {
      $scope.showRating = (typeof newShowRating !== "undefined") ? newShowRating : !$scope.showRating;
      $scope.ratingsOptionText = $scope.showRating ? "Hide Ratings" : "Show Ratings";
      appSettings.showRating = $scope.showRating;
    };
    $scope.toggleRatings(appSettings.showRating);
    
    function setRating($scope, id, r) {
      if (!$scope.curFold.meta[id]) {
        $scope.curFold.meta[id] = {};
      }
      $scope.curFold.meta[id].rating = r;
      $scope.toggleRatings(true);
    }
    
    function doDownload(id, sz) {
      var url = "gvypics/pic/"+id+"?dl=1";
      if (sz) {
        url += "&sz="+sz;
      }
      window.location = url;
    }
    
    function makeGoParams(id) {
      var i = $scope.curFold.pictures.indexOf(id);
      if (i < $scope.curFold.numNativePics) {
        return {id: id};
      } else {
        return {id: $scope.curFold.id, i: i};
      }
    }

    $scope.clickPic = function(id) {
      $state.go('picviewer', makeGoParams(id));
    };

    $scope.moreBack = function() {
      if ($scope.istart > moreBump) {
        $scope.istart -= moreBump;
        $scope.nlimit += moreBump;
      } else {
        $scope.nlimit += $scope.istart;
        $scope.istart = 0;
      }
    };
 
    $scope.moreFwd = function() {
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
        alert.addAlert(err.message);
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
      if (i < 0) {
        i = parseInt($stateParams.i);
        id = $scope.curFold.pictures[i];
        if (!id) {
          i = -1;
        }
      }
      if (i >= 0) {
        if (i < $scope.istart || i >= $scope.istart+$scope.nlimit) {
          // reset range to include current picture
          $scope.istart = Math.floor(i / moreBump) * moreBump;
          $scope.nlimit = moreBump;
          // give angular a chance to respond to istart/nlimit change then try again
          $scope.$applyAsync(initCurPic);
        } else {
          setCurPic(id);
          if (curPic) {
            setSticky();
          } else {
            startScrollTimer(initCurPic, 200);
          }
        }
      } else {
        userScroll = true;
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
          curPicId = id;
        } else {
          curPicId = null;
        }
      }
    }
    
    function isInView(elem, state) {
      var top = elem.getBoundingClientRect().top;
      var bottom = elem.getBoundingClientRect().bottom;
      var wHeight = window.innerHeight;
      var result = false;
      var partial = '';
      if (top < 0) {
        if (bottom >= 0) {
          // top edge is above but bottom is in view
          // declare in view if at least 50% of screen covered
          partial = 'b';
          result = bottom*2 >= wHeight || (state && state.lastPartial === 't');
        }
      } else if (top < wHeight) {
        // top edge is in view
        // declare in view if bottom edge also in view or at least 50% of screen covered
        if (bottom < wHeight) {
          result = true;
        } else {
          partial = 't';
          result = top*2 < wHeight || (state && state.lastPartial === 'b');
        }
      }
      // if partially in view but not not enough, accept next partial of opposite type
      // for example if bottom edge in view, accept next one with top edge in view
      if (state) {
        state.lastPartial = partial;
      }
      return result;
    }
    
    function findInView() {
      if ((!curPic || !isInView(curPic)) && $scope.curFold.pictures.length) {
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
    
    function fixScrollOnce() {
      if (curPic && !isInView(curPic)) {
        curPic.scrollIntoView();
      }
    }
    
    angular.element(window).on('resize', function() {
      if (curPic && !isInView(curPic)) {
        fixScrollOnce();
      }
    });
    
    angular.element(window).on('orientationchange', function() {
      if (curPic && !isInView(curPic)) {
        fixScrollOnce();
      }
    });
  }
]);
