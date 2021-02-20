angular.module('gvyweb').service('gvypics', [
  '$http', '$location', 'fold',
  function($http, $location, fold) {
    var self = this;
    var folderCache = {};
    var token = null;
    this.userId = null;
    
    function makeUrl(meat) {
      var url = $location.protocol() + "://" + $location.host();
      if ($location.port() != 80) {
        url += ":" + $location.port();
      }
      return url + "/gvypics/" + meat;
    }
    
    function handleFailure(resp) {
      if (resp.status === -1) {
        throw new Error("Server not responding, try again later");
      } else if (resp.status === 401) {
        token = null;
        self.userId = null;
        throw new Error("Please sign in again");
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
          var folder = fold.reduceFolder(resp.data);
          folder.ts = new Date();
          folderCache[id] = folder;
          return folder;
        }).catch(handleFailure);
      }
    };

    // delete folders from cache after timeout
    this.cleanFolderCache = function() {
      var now = new Date();
      Object.keys(folderCache).forEach(function(id) {
        var tmax = id ? 60000 : 300000; //1 min all folders except root, 5 min for root
        if ((now - folderCache[id].ts) > tmax) {
          console.log("cache timeout "+id);
          delete folderCache[id];
        }
      });
    };

    // get video folders
    this.getVideoFolders = function() {
      var url = makeUrl("lsv");
      return $http.get(url).then(function(resp) {
        return resp.data.folders;
      }).catch(handleFailure);
    }

    // get folder with video-only option
    this.getVideoFolder = function(id) {
      var url = makeUrl("ls/" + id + "?vo=1");
      return $http.get(url).then(function(resp) {
        return resp.data;
      }).catch(handleFailure);
    }
    
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
    
    this.postMetaChgs = function(chgs) {
      var url = makeUrl("metachgs");
      var body = {
        token: token,
        chgs: chgs
      };
      return $http.post(url, body).then(function() {
        return true;
      }).catch(handleFailure);
    };
  }
]);
