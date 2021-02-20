angular.module('gvyweb').controller('VidFinderCtrl', [
  '$scope', 'gvypics',
  function($scope, gvypics) {
    let active = true;
    $scope.folders = [];
    gvypics.getVideoFolders().then(folderIds => {
        $scope.folders = folderIds.sort().map(id => ({id: id, videos: [], names: []}));
        let chain = Promise.resolve();
        $scope.folders.forEach(folder => {
            chain = chain.then(() => {
                return active && gvypics.getVideoFolder(folder.id).then(props => {
                    folder.name = props.name;
                    Array.prototype.push.apply(folder.videos, props.videos);
                    Object.assign(folder.names, props.names);
                });
            });
        });
        return chain;
    });
    $scope.$on('$destroy', () => {
        active =  false;
    });
  }
]);
