var ratingInnerHTML = [
  "&EmptySmallSquare;",
  "",
  "&bull;",
  "&check;",
  "", ""
];
var ratingClassName = [
  "rating-none",
  "glyphicon glyphicon-remove rating-remove",
  "rating-dot",
  "rating-check",
  "glyphicon glyphicon-star rating-star",
  "glyphicon glyphicon-heart rating-heart"
];

angular.module('gvyweb').directive('rating', function() {
  return {
    restrict: 'E',
    template: '<span></span>',
    scope: {
      level: '<',
      show: '<',
      dflt: '<?default'
    },
    link: function(scope, element) {
      scope.$watch(
        function(scope) { //what to watch
          return scope.show && (scope.level || scope.dflt);
        },
        function() { //what to do when it changes
          if (scope.show) {
            var i = parseInt(scope.level);
            if (isNaN(i)) {
              i = scope.dflt || 0;
            }
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
    "Low Interest",
    "Good",
    "Better",
    "Love It!"
  ];
  this.filterValues = [32, 48, 56];
  this.filterHas = function(filt, level) {
    return (filt || 255) & (1 << level);
  };
  this.filterToggle = function(filt, level) {
    return (filt || 255) ^ (1 << level);
  };
})

.filter('ratingFilter', function() {
  return function(input, meta, filt, dflt) {
    filt = parseInt(filt) || 255;
    if (angular.isArray(input) && angular.isObject(meta)) {
      return input.filter(function(id) {
        var level = parseInt(meta[id] && meta[id].rating);
        if (isNaN(level)) {
          level = dflt || 0;
        }
        return filt & (1 << level);
      });
    } else {
      return input;
    }
  };
});
