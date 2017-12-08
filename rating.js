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
            "&EmptySmallSquare;",
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
            var i = scope.level || 0;
            element[0].innerHTML = innerHTML[i] || "";
            element[0].className = className[i] || "";
          } else {
            element[0].innerHTML = "";
            element[0].className = "";
          }
        }
      );
    }
  };
});
