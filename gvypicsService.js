angular.module('gvyweb').service('gvypics', ['$http', '$location', function($http, $location) {
  var folderCache = {};
  function getFolder(id) {
    if (id in folderCache) {
      return Promise.resolve(folderCache[id]);
    } else {
      var url = "http://" + $location.host();
      if ($location.port() != 80) {
        url += ":" + $location.port();
      }
      url += "/gvypics/ls/" + id;
      return $http.get(url).then(function(resp) {
        folderCache[id] = resp.data;
        return resp.data;
      }).catch(function(resp) {
        if (typeof resp.data === 'string' && !resp.data.startsWith("<!DOCTYPE")) {
          throw new Error(resp.data);
        } else {
          throw new Error(resp.status+" "+resp.statusText);
        }
      });
    }
  }
  return {
    getFolder: getFolder
  };
}]);
