var ratingInnerHTML = [
  "&EmptySmallSquare;",
  "&cross;",
  "&approx;",
  "&check;",
  "", ""
];
var ratingClassName = [
  "", "", "", "",
  "glyphicon glyphicon-star rating-star",
  "glyphicon glyphicon-heart rating-heart"
];

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
          if (scope.show) {
            var i = scope.level || 0;
            element[0].innerHTML = ratingInnerHTML[i] || "";
            element[0].className = ratingClassName[i] || "";
          } else {
            element[0].innerHTML = "";
            element[0].className = "";
          }
        }
      );
    }
  };
})
.service('rating', function() {
  return {
    iconHtml: [0,1,2,3,4,5].map(function(r) {
      var innerHTML = ratingInnerHTML[r] || "";
      var className = ratingClassName[r] || "";
      var s = "<span";
      if (className) {
        s += " class=\"" + className + "\"";
      }
      return s + ">" + innerHTML + "</span>";
    }),
    description: [
      "No Rating",
      "Delete Me",
      "Poor But Keep",
      "Good",
      "Better",
      "Love It!"
    ]
  };
});
