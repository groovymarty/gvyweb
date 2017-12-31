angular.module('gvyweb').service('gvypics', ['$http', '$location', function($http, $location) {
  var folderCache = {};
  var token = null;
  this.userId = null;
  
  // extend array1 with contents of array2
  // like concat but modifies array1 rather than returning a copy of it
  function append(array1, array2) {
    if (array2) {
      array2.forEach(function(item) {
        array1.push(item);
      });
    }
  }

  // transform folder object for faster access and to save memory
  function reduceFolder(folder) {
    if (!folder.meta) {
      folder.meta = {};
    }
    // remember how many pictures were in pictures array originally
    folder.numNativePics = folder.pictures.length;
    if (folder.contents) {
      // append contents arrays to the main folder containers
      append(folder.folders, folder.contents.folders);
      append(folder.videos, folder.contents.videos);
      append(folder.pictures, folder.contents.pictures);
      // merge content names and meta into the main folder
      Object.assign(folder.names, folder.contNames);
      Object.assign(folder.meta, folder.contMeta);
      // contents.meta overrides regular meta, on a individual property basis
      // for example you can provide a different caption for a picture in a collection
      if (folder.contents.meta) {
        Object.keys(folder.contents.meta).forEach(function(id) {
          if (id in folder.meta) {
            Object.assign(folder.meta[id], folder.contents.meta[id]);
          } else {
            folder.meta[id] = folder.contents.meta[id];
          }
        });
      }
      // these are no longer needed
      delete folder.contents;
      delete folder.contNames;
      delete folder.contMeta;
    }
    // if caption exists, replace name with caption
    Object.keys(folder.meta).forEach(function(id) {
      if (folder.meta[id].caption) {
        folder.names[id] = folder.meta[id].caption;
      }
    });
    return folder;
  }
  
  function makeUrl(meat) {
    var url = "http://" + $location.host();
    if ($location.port() != 80) {
      url += ":" + $location.port();
    }
    return url + "/gvypics/" + meat;
  }
  
  function handleFailure(resp) {
    if (resp.status === -1) {
      throw new Error("Server not responding, try again later");
    } else if (typeof resp.data === 'string' && resp.data && !resp.data.startsWith("<!DOCTYPE")) {
      throw new Error(resp.data);
    } else {
      throw new Error(resp.status+" "+resp.statusText);
    }
  }

  // get specified folder
  // return from cache if possible, otherwise fetch from server and add to cache
  this.getFolder = function(id) {
    var i = id.indexOf("-");
    if (i > 0) {
      id = id.substr(0, i);
    }
    if (id in folderCache) {
      return Promise.resolve(folderCache[id]);
    } else {
      var url = makeUrl("ls/" + id);
      return $http.get(url).then(function(resp) {
        var folder = reduceFolder(resp.data);
        folderCache[id] = folder;
        return folder;
      }).catch(handleFailure);
    }
  };
  
  this.login = function(userId, password) {
    var self = this;
    var url = makeUrl("login?user=" + userId + "&pw=" + password);
    return $http.get(url).then(function(resp) {
      token = resp.data;
      self.userId = userId;
      return true;
    }).catch(function(resp) {
      if (resp.status === 403) {
        // incorrect user ID or password
        return false;
      } else {
        handleFailure(resp);
      }
    });
  };
  
  this.logout = function() {
    var self = this;
    var url = makeUrl("logout");
    return $http.get(url).then(function() {
      token = null;
      self.userId = null;
      return true;
    }).catch(handleFailure);
  };
}]);
