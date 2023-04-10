angular.module('gvyweb').controller('VidFinderCtrl', [
  '$scope', 'gvypics',
  function($scope, gvypics) {
    $scope.folders = [];
    gvypics.getVideoFolders().then(result => {
        result.folders.sort().reverse().forEach(folderId => {
            $scope.folders.push({
                id: folderId,
                name: result.names[folderId],
                loaded: false,
                expanded: false,
                videos: [],
                names: {},
                hqExists: {}
            });
        });
    });

    $scope.toggle = function(folder) {
        if (!folder.loaded) {
            gvypics.getVideoFolder(folder.id).then(result => {
                Object.assign(folder.names, result.names);
                result.videos.forEach(vidId => {
                    folder.videos.push(vidId);
                    gvypics.testVideoExists(vidId, 'hq').then(result => {
                        folder.hqExists[vidId] = result;
                    });
                });
            });
            folder.loaded = true;
        }
        folder.expanded = !folder.expanded;
    };
  }
]);
