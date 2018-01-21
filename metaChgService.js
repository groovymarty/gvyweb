angular.module('gvyweb').service('metaChg', [
  '$timeout', 'alert', 'gvypics',
  function($timeout, alert, gvypics) {
    var self = this;
    this.changes = [];
    this.batchLen = 0; //length of batch sent
    this.batchStatus = 0; //0=pending, 1=success, -1=failure
    this.activeBatchLen = 0; //same as batchLen but cleared to zero after response received
    this.autoSend = true;
    var delayTimer = null;
    
    this.addChange = function(id, chg) {
      chg.id = id;
      // add change to list
      this.changes.push(chg);
      // possibly do a batch now
      if (!this.batchLen && !delayTimer) {
        doBatch();
      }
    };
    
    function doBatch(manual) {
      // timer has expired or wasn't running anyway
      delayTimer = null;
      if (self.changes.length && (self.autoSend || manual)) {
        // start a batch with our list of meta changes
        self.batchLen = self.changes.length;
        self.activeBatchLen = self.batchLen;
        self.batchStatus = 0;
        // post the batch to the server
        console.log("posting batch of "+self.batchLen);
        gvypics.postMetaChgs(self.changes.slice(0, self.batchLen)).then(function() {
          // success, throw away batch
          console.log("batch accepted");
          self.batchStatus = 1;
          self.activeBatchLen = 0;
          self.changes = self.changes.slice(self.batchLen);
          self.batchLen = 0;
          // delay before sending next batch
          if (self.autoSend) {
            delayTimer = $timeout(doBatch, 15000);
          }
        }).catch(function(err) {
          // failure, zero out the batch length and try again later
          console.log("batch rejected, "+err.message);
          self.batchStatus = -1;
          self.activeBatchLen = 0;
          alert.addAlert(err.message);
          // try again after delay
          if (self.autoSend) {
            $timeout(doBatch, 60000);
          }
        });
      } else {
        // no changes to send now
        self.batchLen = 0;
        self.batchStatus = 0;
      }
    }
    
    this.toggleAutoSend = function() {
      cancelTimer();
      this.autoSend = !this.autoSend;
      if (this.autoSend && !this.activeBatchLen) {
        doBatch();
      }
    };
    
    this.sendNow = function() {
      cancelTimer();
      if (!this.activeBatchLen) {
        doBatch(true);
      }
    };
    
    function cancelTimer() {
      if (delayTimer) {
        $timeout.cancel(delayTimer);
        delayTimer = null;
      }
    }
  }
]);
