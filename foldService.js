angular.module('gvyweb').service('fold', [
  function() {
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
    this.reduceFolder = function(folder) {
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
      return folder;
    };

    // build caption text array for folder
    this.buildCapText = function(folder, showId) {
      var capText = {};
      Object.keys(folder.names).forEach(function(id) {
        var caption = folder.meta[id] && folder.meta[id].caption;
        if (caption) {
          if (showId) {
            capText[id] = id + " | " + caption;
          } else {
            capText[id] = caption;
          }
        } else {
          capText[id] = folder.names[id];
        }
      });
      return capText;
    };
    
    // return default rating for folder
    this.getDefaultRating = function(folder) {
      var val= ('_folder' in folder.meta) && folder.meta._folder.rated ? 3 : 0;
      console.log("getDefaultRating=", val);
      return val;
    };
  }
]);
