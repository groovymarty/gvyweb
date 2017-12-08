angular.module('gvyweb').directive('rating', function() {
  return {
    restrict: 'E',
    template: '<span></span>',
    scope: {
      level: '<',
      show: '<'
    },
    link: function(scope, element) {
      scope.$watch(
        function(scope) { //what to watch
          return scope.show && scope.level;
        },
        function() { //what to do when it changes
          var innerHTML = [
            "&check;",
            "&cross;",
            "&approx;",
            "&check;",
            "", ""
          ];
          var className = [
            "", "", "", "",
            "glyphicon glyphicon-star rating-star",
            "glyphicon glyphicon-heart rating-heart"
          ];
          if (scope.show) {
            element[0].innerHTML = innerHTML[scope.level] || "";
            element[0].className = className[scope.level] || "";
          } else {
            element[0].innerHTML = "";
            element[0].className = "";
          }
        }
      );
    }
  };
});
