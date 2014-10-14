angular.module('tkPlayer').service('player', ['$rootScope', 'tkPlayerPlaylist', function($rootScope, tkPlayerPlaylist){
	
    var service = {};

    service.currentVideo = {};

	service.addSource = function(type, src, play){

        var source = { type: type, src: src };

        // Add a new video to the playlist
        tkPlayerPlaylist.push(source);

        // Broadcast it
        $rootScope.$broadcast('player-add-source', source);

        // If direct play
        if(play){
            // Change current video
            service.currentVideo = source;
        }

        return source;
    }

	return service;
}]);