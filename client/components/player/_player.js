var module = angular.module('tkPlayer', []);

module.constant('tkPlayerOptions', {
    RESTRICT: 'A',
    VOLUME_STEPS: 0.1,
    VOLUME_MINIMUM: 0,
    VOLUME_MAXIMUM: 1
});

module.value('tkPlayerPlaylist', []);