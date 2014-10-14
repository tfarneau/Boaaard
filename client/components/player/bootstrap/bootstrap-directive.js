angular.module('tkPlayer').directive('tkPlayer', ['tkPlayerOptions', 'tkPlayerPlaylist', 'player', function(tkPlayerOptions, tkPlayerPlaylist, player) {
	return {
		restrict: tkPlayerOptions.RESTRICT,
		templateUrl : 'components/player/bootstrap/bootstrap.html',
		controller: ['$window', '$rootScope', '$scope', 'player', function($window, $rootScope, $scope, player) {

			/**
			 * Video
			 * @type {[type]}
			 */
		    $scope.video = tkPlayerPlaylist[0] || null;

		    /**
		     * Player
		     * @type {Object}
		     */
            $scope.playerEl = {};

            /**
             * Playing configuration
             * @type {Boolean}
             */
            $scope.playing = false;

            /**
             * Loading configuration
             * @type {Boolean}
             */
            $scope.loading = true;

            /**
             * Open video
             * @param  {object} source [description]
             */
            $scope.open = function open(source) {

            	// If is valid
                if ( ('src' in source && 'type' in source) ) {

                	// Change video source
	                $scope.video = source;
	                $scope.playerEl.setAttribute('src', source.src);
	                $scope.playerEl.setAttribute('type', source.type);
	                $scope.playerEl.load();

                }
            };
		}],
		link : function(scope, element) {

			// Get the container
			scope.container = element[0];

			// Get the player
			scope.playerEl = element.find('video')[0];

			// On video add source
			scope.$on('player-add-source', function() {
				
				// If just one video in playlist
				if(tkPlayerPlaylist.length === 1){
                	scope.open(tkPlayerPlaylist[0]);
				}

            });

			// On current video change
            scope.$watch(function watchSource() {

                return player.currentVideo;

            }, function playVideo() {

            	// If current video exist
                if (player.currentVideo) {

                	// We play it !
                    scope.open(player.currentVideo);

                }
                
            });
		}
	}
}]);