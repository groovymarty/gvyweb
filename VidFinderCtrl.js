angular.module('gvyweb').controller('VidFinderCtrl', [
  '$scope', 'gvypics',
  function($scope, gvypics) {
    let active = true;
    $scope.folders = [];
    // get array of folder ids that contain videos
    gvypics.getVideoFolders().then(folderIds => {
        // chain promises for sequential execution
        let chain = Promise.resolve();
        // throw away current folders array
        $scope.folders.splice(0);
        // map each folder id to a folder object
        Array.prototype.push.apply($scope.folders,
            folderIds.sort().map(id => {
                // try to get folder from cache
                let folder = gvypics.getCachedVideoFolder(id);
                if (!folder) {
                    // must make new folder
                    folder = {id: id, videos: [], names: []};
                    // chain a promise to get folder
                    chain = chain.then(() => {
                        return active && gvypics.getVideoFolder(folder.id).then(props => {
                            // have folder, update properties
                            folder.name = props.name;
                            Array.prototype.push.apply(folder.videos, props.videos);
                            Object.assign(folder.names, props.names);
                        });
                    });
                }
                return folder;
            })
        );
        return chain;
    });
    $scope.$on('$destroy', () => {
        active =  false;
    });
  }
]);
