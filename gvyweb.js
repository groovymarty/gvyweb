var myApp = angular.module('gvyweb', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.contextMenu', 'ngAnimate']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      displayName: "Home",
      url: "/home",
      controller: "HomeCtrl",
      templateUrl: "homeView.html"
    })
    .state('picbrowser', {
      displayName: "Pictures",
      url: "/picbrowser/:id?i?sz?showid?res",
      controller: "PicBrowserCtrl",
      templateUrl: "picBrowserView.html",
      params: {i: null, sz: null, showid: null, res: null}
    })
    .state('picviewer', {
      displayName: "Pictures",
      hideNavBar: true,
      url: "/picviewer/:id?i",
      controller: "PicViewerCtrl",
      templateUrl: "picViewerView.html",
      params: {i: null}
    })
    .state('vidfinder', {
      displayName: "Videos",
      url: "/vidfinder",
      controller: "VidFinderCtrl",
      templateUrl: "vidFinderView.html"
    })
    .state('slideshows', {
      displayName: "Slide Shows",
      url: "/slideshows",
      controller: "SlideShowsCtrl",
      templateUrl: "slideShowsView.html"
    })
    .state('docs', {
      displayName: "Documents",
      url: "/docs",
      controller: "DocsCtrl",
      templateUrl: "docsView.html"
    })
    .state('house', {
      displayName: "Our House",
      url: "/house",
      controller: "HouseCtrl",
      templateUrl: "houseView.html"
    })
    .state('chanviewer', {
      displayName: "Our House",
      url: "/chanviewer",
      controller: "ChanViewerCtrl",
      templateUrl: "chanViewerView.html"
    })
    .state('login', {
      displayName: "Sign In",
      url: "/login",
      controller: "LoginCtrl",
      templateUrl: "loginView.html"
    })
    .state('logout', {
      displayName: "Sign Out",
      url: "/logout",
      controller: "LoginCtrl",
      templateUrl: "logoutView.html"
    })
    .state('changes', {
      displayName: "Changes",
      url: "/changes",
      controller: "ChangesCtrl",
      templateUrl: "changesView.html"
    });
    
  $urlRouterProvider.otherwise("/home");
});

myApp.controller('NavBarCtrl', [
  '$scope', '$state', 'gvypics', 'metaChg',
  function($scope, $state, gvypics, metaChg) {
    $scope.$state = $state;
    $scope.gvypics = gvypics;
    $scope.metaChg = metaChg;
    $scope.isCollapsed = true;
    $scope.collapse = function() {
      $scope.isCollapsed = true;
    };
    $scope.toggleCollapsed = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
  }
]);

myApp.service('appSettings',
  function() {
    this.tileSize = 'sm';
    this.showRating = false;
    this.ratingFilter = 0;
    this.showId = true;
    this.videoRes = 'std';
  }
);
