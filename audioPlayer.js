angular.module('gvyweb').component('audioPlayer', {
  bindings: {
    tracks: '<'
  },

  template: `
    <div class="audio-player" ng-class="{playing: $ctrl.isPlaying}">
      <audio controls preload="metadata"></audio>

      <ul class="playlist">
        <li ng-repeat="track in $ctrl.tracks track by $index"
            ng-click="$ctrl.selectTrack($index, true)"
            ng-class="{active: $index === $ctrl.currentIndex}">
          {{track.title}}
        </li>
      </ul>
    </div>
  `,

  controller: ['$element', '$scope', '$rootScope', function ($element, $scope, $rootScope) {
    var ctrl = this;
    var audio = null;
    var unregisterOtherPlayerListener = angular.noop;

    ctrl.currentIndex = -1;
    ctrl.currentTrack = null;
    ctrl.isPlaying = false;
    ctrl.playerId = 'audioPlayer_' + Math.random().toString(36).slice(2);

    ctrl.$onInit = function () {
      audio = $element[0].querySelector('audio');

      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);

      unregisterOtherPlayerListener = $rootScope.$on('audioPlayerStarted', function (event, playerId) {
        if (playerId !== ctrl.playerId) {
          ctrl.isPlaying = false;
          stopAudio();
          $scope.$applyAsync();
        }
      });

      ctrl.selectTrack(0, false);
      syncAudioSource();
    };

    ctrl.$onChanges = function (changes) {
      if (changes.tracks && ctrl.tracks && ctrl.tracks.length) {
        if (ctrl.currentIndex < 0 || ctrl.currentIndex >= ctrl.tracks.length) {
          ctrl.currentIndex = 0;
        }
        ctrl.currentTrack = ctrl.tracks[ctrl.currentIndex];
        syncAudioSource();
      }
    };

    ctrl.$onDestroy = function () {
      if (audio) {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
      }

      unregisterOtherPlayerListener();
    };

    ctrl.selectTrack = function (index, autoplay) {
      if (!ctrl.tracks || index < 0 || index >= ctrl.tracks.length) {
        return;
      }

      ctrl.currentIndex = index;
      ctrl.currentTrack = ctrl.tracks[index];
      syncAudioSource();

      if (autoplay) {
        audio.play();
      }
    };

    function syncAudioSource() {
      if (!audio || !ctrl.currentTrack || !ctrl.currentTrack.file) {
        return;
      }

      audio.src = ctrl.currentTrack.file;
    }

    function stopAudio() {
      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
    }

    function onPlay() {
      ctrl.isPlaying = true;
      $rootScope.$broadcast('audioPlayerStarted', ctrl.playerId);
      $scope.$applyAsync();
    }

    function onPause() {
      ctrl.isPlaying = false;
      $scope.$applyAsync();
    }

    function onEnded() {
      ctrl.isPlaying = false;
      ctrl.selectTrack(ctrl.currentIndex+1, true);
      $scope.$applyAsync();
    }
  }]
});