angular.module('gvyweb').controller('LoginCtrl', [
  '$scope', '$state', 'gvypics', 'alert',
  function($scope, $state, gvypics, alert) {
    $scope.userId = "";
    $scope.password = "";
    $scope.tryAgain = false;

    $scope.loginClick = function() {
      if (!$scope.userId || !$scope.password) {
        $scope.tryAgain = true;
      } else {
        gvypics.login($scope.userId, $scope.password).then(function(result) {
          if (result) {
            $state.go('home');
          } else {
            $scope.tryAgain = true;
          }
        }).catch(function(err) {
          alert.addAlert(err.message);
        });
      }
    };

    $scope.logoutClick = function() {
      gvypics.logout().then(function() {
        $state.go('home');
      }).catch(function(err) {
        alert.addAlert(err.message);
      });
    };
  }
]);
