angular.module('gvyweb').controller('VidFinderCtrl', [
  '$scope', 'gvypics', '$http',
  function($scope, gvypics, $http) {
    $scope.folders = [];
    gvypics.getVideoFolders().then(result => {
        result.folders.sort().forEach(folderId => {
            $scope.folders.push({
                id: folderId,
                name: result.names[folderId],
                loaded: false,
                expanded: false,
                videos: [],
                hqExists: {}
            });
        });
    });

    $scope.toggle = function(folder) {
        if (!folder.loaded) {
            gvypics.getVideoFolder(folder.id).then(result => {
                result.videos.forEach(vidId => {
                    folder.videos.push(vidId);
                    $http.head('/gvypics/vid/'+vidId+'?res=hq')
                        .then(() => {
                            folder.hqExists[vidId] = true;
                        })
                        .catch(() => {
                            console.log("no hq for", vidId);
                        });
                });
            });
            folder.loaded = true;
        }
        folder.expanded = !folder.expanded;
    };
  }
]);
