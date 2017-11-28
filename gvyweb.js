var myApp = angular.module('gvyweb', ['ui.router', 'ui.bootstrap', 'ngAnimate']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      displayName: "Home",
      url: "/home",
      templateUrl: "home.html"
    })
    .state('picbrowser', {
      displayName: "Pictures",
      url: "/picbrowser/:id?i?sz",
      controller: "PicBrowserCtrl",
      templateUrl: "picBrowser.html",
      params: {i: null, sz: null}
    })
    .state('picviewer', {
      displayName: "Pictures",
      hideNavBar: true,
      url: "/picviewer/:id?i",
      controller: "PicViewerCtrl",
      templateUrl: "picViewer.html",
      params: {i: null}
    })
    .state('slideshows', {
      displayName: "Slide Shows",
      url: "/slideshows",
      controller: "SlideShowsCtrl",
      templateUrl: "slideShows.html"
    });
    
  $urlRouterProvider.otherwise("/home");
});

myApp.controller('NavBarCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.$state = $state;
  $scope.isCollapsed = true;
  $scope.collapse = function() {
    $scope.isCollapsed = true;
  };
  $scope.toggleCollapsed = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
}]);
