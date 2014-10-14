var app = angular.module('App', ['tkPlayer'])

.controller('AppCtrl', ['$scope', '$http', 'player', 'tkPlayerPlaylist', function($scope, $http, player, tkPlayerPlaylist) {

	$scope.$on('player-add-source', function registerMessageEvents(event, data) {
		
	});

	$scope.loadVideo = function(choice) {

		$http.jsonp(
			'http://api.ted.com/v1/talks/' + choice + '.json',
			{
				params : {
					'callback' : 'JSON_CALLBACK',
					'api-key' : 'cp3fqgk7bfay2xaz4v37exzz'
				}
			} 
		).success(function(data, status, headers, config) {

			player.addSource('mp4', data.talk.media.internal['podcast-high'].uri, true);

		});

	}

}]);