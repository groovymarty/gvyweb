angular.module('gvyweb').controller('PicBrowserCtrl', [
  '$scope', '$stateParams', '$state', '$location', '$timeout',
  'gvypics', 'alert', 'appSettings', 'rating', 'metaChg', 'fold',
  function($scope, $stateParams, $state, $location, $timeout,
           gvypics, alert, appSettings, rating, metaChg, fold) {
    var placeholder = {
      isPlaceholder: true,
      id: "",
      folders: [],
      pictures: [],
      videos: [],
      names: {},
      meta: {}
    };
    $scope.appSettings = appSettings;
    $scope.rating = rating;
    $scope.root = placeholder;
    $scope.firstlevel = placeholder;
    $scope.path = [];
    $scope.curFold = placeholder;
    $scope.defaultRating = 0;
    $scope.istart = 0;
    $scope.nlimit = 0;
    $scope.showRocket = false;
    $scope.capText = {};
    $scope.showCapEdit = false;
    var curPic = null; //DOM pic-tile element
    var curPicId = null;
    var moreBump = 10;
    var rocketTimer = null;
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
        return $scope.showIdOptionText;
      },
      click: function($itemScope) {
        setCurPic($itemScope.id);
        setSticky();
        $scope.toggleShowId();
      }
    },{
      text: function() {
        return appSettings.showRating ? "Hide Ratings" : "Show Ratings";
      },
      click: function($itemScope) {
        setCurPic($itemScope.id);
        setSticky();
        $scope.setRatingFilter(appSettings.showRating ? -1 : 0);
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
    }].concat([5,4,3,2,1,0].map(function(r) {
      return {
        text: "Set: " + rating.iconHtml[r] + " = " + rating.description[r] + " (" + r + ")",
        displayed: function() {return gvypics.userId;},
        hasTopDivider: r===5,
        click: function($itemScope) {
          setRating($itemScope.$parent, $itemScope.id, r);
        }
      };
    }).concat([{
      text: "Edit Caption",
      displayed: function() {return gvypics.userId;},
      hasTopDivider: true,
      click: function($itemScope) {
        openCapEdit($itemScope.$parent, $itemScope.id);
      }
    },{
      text: "<span class=\"glyphicon glyphicon-remove\"></span> Close Menu",
      hasTopDivider: true
    }]));
    
    $scope.rotateTileSz = function(newSz) {
      $scope.sz = newSz || (($scope.sz === "sm") ? "md" : "sm");
      appSettings.tileSize = $scope.sz;
      switch ($scope.sz) {
        case "sm":
          moreBump = 100;
          $scope.tileSzOptionText = "Large Tiles";
          break;
        case "md":
          moreBump = 50;
          $scope.tileSzOptionText = "Small Tiles";
          break;
      }
      if (curPicId) {
        resetRange();
      }
    };
    $scope.rotateTileSz($stateParams.sz || appSettings.tileSize);
    
    $scope.setRatingFilter = function(filt) {
      if (filt < 0) {
        appSettings.showRating = false;
        appSettings.ratingFilter = 0;
        $scope.showAllText = "Show Ratings";
        $scope.showFilter = false;
        $scope.showFilterSticky = false;
      } else {
        appSettings.showRating = true;
        appSettings.ratingFilter = filt;
        $scope.showAllText = "Show All Pictures";
      }
      if (curPicId) {
        resetRange();
      }
    };
    // process filt query parameter, not part of state
    var filt = parseInt($location.search().filt);
    if (!isNaN(filt)) {
      appSettings.showRating = true;
      appSettings.ratingFilter = filt;
    }
    $scope.setRatingFilter(appSettings.showRating ? appSettings.ratingFilter : -1);
    
    $scope.toggleRatingFilter = function(level) {
      $scope.setRatingFilter(rating.filterToggle(appSettings.ratingFilter, level));
    };
    
    function setRating($scope, id, level) {
      if (!$scope.curFold.meta[id]) {
        $scope.curFold.meta[id] = {};
      }
      $scope.curFold.meta[id].rating = level;
      metaChg.addChange(id, {rating: level});
      if (!appSettings.showRating) {
        $scope.setRatingFilter(0);
      }
    }
    
    $scope.toggleShowId = function(val) {
      appSettings.showId = typeof val === 'boolean' ? val : !appSettings.showId;
      $scope.showIdOptionText = appSettings.showId ? "Captions Without ID" : "Captions With ID";
      $scope.capText = fold.buildCapText($scope.curFold, appSettings.showId);
    };
    function parseBool(val, dflt) {
      if (typeof val === 'boolean') {
        return val;
      } else if (typeof val === 'number') {
        return !!val;
      } else if (typeof val === 'string') {
        return val === "true" || !!parseInt(val);
      } else {
        return dflt ? true : false;
      }
    }
    $scope.toggleShowId(parseBool($stateParams.showid, appSettings.showId));
    
    $scope.toggleVideoRes = function(val) {
      $scope.res = val ? val : $scope.res==='hq' ? 'std' : 'hq';
      appSettings.videoRes = $scope.res;
      $scope.videoResOptionText = $scope.res==='hq' ? "Standard Video" : "HQ Video";
    };
    $scope.toggleVideoRes($stateParams.res || appSettings.videoRes);
    
    function openCapEdit($scope, id) {
      $scope.capEditId = id;
      $scope.capEditText = ($scope.curFold.meta[id] && $scope.curFold.meta[id].caption) || "";
      $scope.showCapEdit = true;
    }
    
    $scope.closeCapEdit = function(apply) {
      if (apply) {
        var id = $scope.capEditId;
        if (!$scope.curFold.meta[id]) {
          $scope.curFold.meta[id] = {};
        }
        $scope.curFold.meta[id].caption = $scope.capEditText;
        metaChg.addChange(id, {caption: $scope.capEditText});
        $scope.capText = fold.buildCapText($scope.curFold, appSettings.showId);
      }
      $scope.showCapEdit = false;
    };
    
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
        var result = extendRange($scope.istart, moreBump, -1);
        $scope.istart -= result.len;
        $scope.nlimit += result.len;
      } else {
        $scope.nlimit += $scope.istart;
        $scope.istart = 0;
      }
    };
 
    $scope.moreFwd = function() {
      $scope.nlimit += extendRange($scope.nlimit, moreBump).len;
    };
 
    $scope.showVideo = true;
    $scope.selectedVideo = '';
    $scope.selectedVideoSrc = '';
    $scope.toggleShowVideo = function() {
      $scope.showVideo = !$scope.showVideo;
      if (!$scope.showVideo) {
        $scope.selectedVideo = '';
        $scope.selectedVideoSrc = '';
      }
    };
    $scope.selectVideo = function(id) {
      $scope.selectedVideo = id;
      $scope.selectedVideoSrc = "gvypics/vid/" + id;
    };
    $scope.showFilter = false;
    $scope.toggleShowFilter = function() {
      $scope.showFilter = !$scope.showFilter;
      if ($scope.showFilter) {
        $scope.showFilterSticky = true;
      }
    };

    // get specified folder and insert at beginning of path
    // continue recursively until root folder reached
    function buildPath(id) {
      return gvypics.getFolder(id).then(function(folder) {
        if ($scope.curFold.isPlaceholder) {
          $scope.capText = fold.buildCapText(folder, appSettings.showId);
          $scope.curFold = folder;
          $scope.defaultRating = fold.getDefaultRating(folder);
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
    gvypics.cleanFolderCache();
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
          resetRange(i);
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
        resetRange();
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
    
    // reset range to include current picture
    function resetRange(i) {
      if (typeof i === 'undefined') {
        i = $scope.curFold.pictures.indexOf(curPicId);
        if (i < 0) {
          i = 0;
        }
      }
      // bracket current picture in range based on current "bump" size
      $scope.istart = Math.floor(i / moreBump) * moreBump;
      // possibly extend range higher to find enough pictures if we're filtering
      var result = extendRange($scope.istart, moreBump);
      $scope.nlimit = result.len;
      // did we find enough?
      if (result.nfound < moreBump) {
        // extend range lower as well
        var result2 = extendRange($scope.istart, moreBump-result.nfound, -1);
        $scope.istart -= result2.len;
        $scope.nlimit += result2.len;
      }
      if (curPic) {
        $scope.$applyAsync(setSticky);
      }
    }
    
    // determine length of range needed to include specified number of displayed pictures
    // returns object with "len" and "nfound" properties
    function extendRange(istart, nwanted, direction) {
      if (!appSettings.ratingFilter) {
        // no filtering, all pictures are displayed
        return {len: nwanted, nfound: nwanted};
      } else {
        var meta = $scope.curFold.meta || {};
        var accum = {len: 0, nfound: 0};
        var reduceFunc = function(accum, id) {
          if (accum.nfound < nwanted) {
            var level = (meta[id] && meta[id].rating) || 0;
            if (rating.filterHas(appSettings.ratingFilter, level)) {
              accum.nfound += 1;
            }
            accum.len += 1;
          }
          return accum;
        };
        if ((direction || 1) > 0) {
          return $scope.curFold.pictures.slice(istart).reduce(reduceFunc, accum);
        } else {
          return $scope.curFold.pictures.slice(0, istart).reduceRight(reduceFunc, accum);
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
    
    function startRocketTimer(f, t) {
      cancelRocketTimer();
      rocketTimer = $timeout(f, t);
    }
    
    function cancelRocketTimer() {
      if (rocketTimer) {
        $timeout.cancel(rocketTimer);
        rocketTimer = null;
      }
    }
    
    $scope.$on('$destroy', function() {
      cancelScrollTimer();
      cancelRocketTimer();
    });
    
    angular.element(window).on('scroll', function() {
      var scrollY = window.scrollY;
      if (userScroll) {
        var delta = scrollY - lastScrollY;
        if (scrollY && delta < -50) {
          $scope.showRocket = true;
          startRocketTimer(function() {
            $scope.showRocket = false;
          }, 3000);
        }
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
    
    $scope.rocketClick = function() {
      window.scrollTo(0, 0);
      cancelRocketTimer();
      $scope.showRocket = false;
    };
  }
]);
