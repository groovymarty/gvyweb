var myApp = angular.module('gvyweb', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngTouch']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      displayName: "Home",
      url: "/home",
      templateUrl: "home.html"
    })
    .state('picbrowser', {
      displayName: "Pictures",
      url: "/picbrowser/:id",
      controller: "PicBrowserCtrl",
      templateUrl: "picBrowser.html",
      params: {sz: null}
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
