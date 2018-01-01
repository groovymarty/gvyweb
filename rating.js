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
            var i = parseInt(scope.level) || 0;
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
  this.iconHtml = [0,1,2,3,4,5].map(function(r) {
    var innerHTML = ratingInnerHTML[r] || "";
    var className = ratingClassName[r] || "";
    var s = "<span";
    if (className) {
      s += " class=\"" + className + "\"";
    }
    return s + ">" + innerHTML + "</span>";
  });
  this.description = [
    "No Rating",
    "Delete Me",
    "Poor But Keep",
    "Good",
    "Better",
    "Love It!"
  ];
  this.filterValues = [32, 48, 56, 12, 6, 1];
  this.filterHas = function(bits, level) {
    return bits & (1 << level);
  };
})

.filter('ratingFilter', function() {
  return function(input, meta, bits) {
    bits = parseInt(bits) || 255;
    if (angular.isArray(input) && angular.isObject(meta)) {
      return input.filter(function(id) {
        var level = meta[id] && meta[id].rating;
        return bits & (1 << (parseInt(level) || 0));
      });
    } else {
      return input;
    }
  };
});
