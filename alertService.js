angular.module('gvyweb').service('alert', [
  function() {
    this.alerts = [];
    this.addAlert = function(msg, type) {
      return this.alerts.push({
        msg: msg,
        type: type || "danger"
      });
    };
    this.removeAlert = function(index) {
      this.alerts.splice(index, 1);
    };
  }
]);

angular.module('gvyweb').controller('AlertCtrl', [
  '$scope', 'alert',
  function($scope, alert) {
    $scope.alerts = alert.alerts;
    $scope.closeAlert = function(index) {
      alert.removeAlert(index);
    };
  }
]);
