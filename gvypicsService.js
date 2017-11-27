angular.module('gvyweb').service('gvypics', ['$http', '$location', function($http, $location) {
  var folderCache = {};
  
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
    var meta = folder.meta || {};
    delete folder.meta;
    // remember how many pictures were in pictures array originally
    folder.numNativePics = folder.pictures.length;
    if (folder.contents) {
      // append contents arrays to the main folder containers
      append(folder.folders, folder.contents.folders);
      append(folder.videos, folder.contents.videos);
      append(folder.pictures, folder.contents.pictures);
      // merge content names and meta into the main folder
      Object.assign(folder.names, folder.contNames);
      Object.assign(meta, folder.contMeta);
      // contents.meta overrides regular meta, on a individual property basis
      // for example you can provide a different caption for a picture in a collection
      if (folder.contents.meta) {
        Object.keys(folder.contents.meta).forEach(function (id) {
          if (id in meta) {
            Object.assign(meta[id], folder.contents.meta[id]);
          } else {
            meta[id] = folder.contents.meta[id];
          }
        });
      }
      // these are no longer needed
      delete folder.contents;
      delete folder.contNames;
      delete folder.contMeta;
    }
    // if caption exists, replace name with caption
    Object.keys(meta).forEach(function(id) {
      if (meta[id].caption) {
        folder.names[id] = meta[id].caption;
      }
    });
    return folder;
  }

  // get specified folder
  // return from cache if possible, otherwise fetch from server and add to cache
  this.getFolder = function(id) {
    if (id in folderCache) {
      return Promise.resolve(folderCache[id]);
    } else {
      var url = "http://" + $location.host();
      if ($location.port() != 80) {
        url += ":" + $location.port();
      }
      url += "/gvypics/ls/" + id;
      return $http.get(url).then(function(resp) {
        var folder = reduceFolder(resp.data);
        folderCache[id] = folder;
        return folder;
      }).catch(function(resp) {
        if (typeof resp.data === 'string' && !resp.data.startsWith("<!DOCTYPE")) {
          throw new Error(resp.data);
        } else {
          throw new Error(resp.status+" "+resp.statusText);
        }
      });
    }
  };
}]);
