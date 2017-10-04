var myApp = angular.module('gvyweb', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngTouch']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "home.html"
    })
    .state('pictures', {
      url: "/pictures",
      template: "<h1>Pictures coming soon!</h1>"
    })
    .state('slideshows', {
      url: "/slideshows",
      template: "<h1>Slide shows coming soon!</h1>"
    });
    
  $urlRouterProvider.otherwise("/home");
});

myApp.controller('NavBarCtrl', ['$scope', function($scope) {
  $scope.isCollapsed = true;
  $scope.collapse = function() {
    $scope.isCollapsed = true;
  };
  $scope.toggleCollapsed = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
}]);
