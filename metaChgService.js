angular.module('gvyweb').service('metaChg', [
  '$timeout', 'alert', 'gvypics',
  function($timeout, alert, gvypics) {
    var self = this;
    var changes = [];
    this.numChanges = 0;
    var batch = null;
    this.batchLen = 0;
    
    this.addChange = function(id, chg) {
      chg.id = id;
      // add change to list
      changes.push(chg);
      this.numChanges = changes.length;
      // possibly do a batch now
      if (!batch) {
        doBatch();
      }
    };
    
    function doBatch() {
      if (changes.length) {
        // start a batch with our list of meta changes
        batch = changes;
        self.batchLen = batch.length;
        // continue to accumulate new changes for next batch
        changes = [];
        self.numChanges = 0;
        // post the batch to the server
        console.log("posting batch of "+self.batchLen);
        gvypics.postMetaChgs(batch).then(function() {
          // success, throw away batch
          console.log("batch accepted");
          self.batchLen = 0;
          // delay before sending next batch
          $timeout(doBatch, 15000);
        }).catch(function(err) {
          // failure, put the batch back into the list
          console.log("batch rejected, "+err.message);
          alert.addAlert(err.message);
          changes = batch.concat(changes);
          self.numChanges = changes.length;
          self.batchLen = 0;
          // try again after delay
          $timeout(doBatch, 60000);
        });
      } else {
        // no changes to send now
        batch = null;
        self.batchLen = 0;
      }
    }
  }
]);
