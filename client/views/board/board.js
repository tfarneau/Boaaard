angular
	.module('boViewBoard', [])
	.controller('BoardCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'Api', 'localStorageService', 'Socket', 'Find', function($scope, $rootScope, $routeParams, $timeout, $location, Api, localStorageService, Socket, Find) {

		// Connect new socket
		Socket.connect();

		// Display full header
		$rootScope.fullHeader = true;

		/**
		 * Get board
		 * @param  {obj} result API result
		 */
        Api.Board.get($routeParams.slug).then(function(result){

        	// Stock the board
        	$scope.board = result.data.data;

        	// Set the page title
        	$rootScope.title = "Boaaard - " + $scope.board.infos.name;

    		// For each blocks
    		(function checkBlocks(i){

    			// If block exist
				if(typeof $scope.board.blocks[i] != "undefined") {

					if($scope.board.blocks[i].type!="image"){

						var input = $scope.board.blocks[i].var;

						if(input){
			                input = input.replace(/#/g, '%23');
			            }

						// Get the content of block
						Api.Block.get($scope.board.blocks[i].type,input,false).then(function(results){
							// En stock it
							$scope.board.blocks[i].content = results.data.data.content;
						});
					}

					// Check the next block
					checkBlocks(i+1);
				}

			})(0);
        });


        // Get the slug in params
        $scope.slug = $routeParams.slug;

        // Input chat username
        $scope.username = null;

        // Get user in localstorage or set to null
        $scope.user = localStorageService.get('user') || null;

        /**
         * Connect to chat
         */
        $scope.connect = function() {

        	// If user find in localstorage
        	if($scope.user)
        		$scope.username = $scope.user; // Set the username

        	// Emit socket for connect user to board chat
            Socket.emit('connectToChat', {
            	'pseudo' : $scope.username,
            	'slug' : $scope.slug
            });
        }

        // If user in localstorage
        if($scope.user) {
        	// Connect it !
        	$scope.connect();
        }

        // Chat messages
        $scope.messages = [];

        /**
         * Get old messages
         * @return {obj}      Old messages
         */
    	Socket.on('oldMessages', function(data) {

    		// For each messages
			for(var i in data.oldmessages){
				// Add messages to chat
				$scope.messages.push(data.oldmessages[i])
			}

			// And display it !
			$scope.$apply();
		});

    	/**
    	 * On user connected to chat
    	 * @return {obj} chat user data
    	 */
		Socket.on('connectedToChat', function(data){

			// Pseudo already use
			$scope.alreadyuse = false;

			// If pseudo already use
			if(data == false){
				$scope.alreadyuse = true;
        		$scope.$apply();
			}
			else{

				// If not local user
				if(!$scope.user) {
	
					// Set user					
	        		$scope.user = $scope.username;

	        		// Add user in localstorage
	            	localStorageService.set('user', $scope.username);
	        	}

	        	// If current user
				if($scope.user == data.pseudo)
					$scope.connected = true; // Allow connection

				// If in same board
				if($scope.slug == data.slug)
					hello(data.pseudo); // Say hello 
        	}
		});

		/**
		 * On new message to chat
		 * @return {obj} new message
		 */
		Socket.on('newMessageToChat', function(data){

			// Add message to chat
			$scope.messages.push(data);
			$scope.$apply(); // Display it

			// If remote connected
			if($scope.remote.connected){

				// Send message to remote
				Socket.emit('sendMessageToRemote', {
					message : data,
					roomid : $scope.roomid
				});
			}
		});

		// New message
		$scope.newMessage = null;

		/**
		 * Add a message to chat
		 * @param {string} message content
		 */
        $scope.addMessage = function(message) {

        	// If message not null
        	if(message.trim().length > 0){

	        	var newMessage = {
	        		message : message,
	        		pseudo : $scope.user,
	        		slug : $scope.slug,
	        		date : new Date().getTime()
	        	}

	        	// Emit new message
	        	Socket.emit('sendMessageToChat', newMessage);

	        	// Reset input
	        	$scope.newMessage = null;
        	}
        }

        /**
         * If remote send message
         * @param  {obj} data message content
         */
        Socket.on('receiveMessageFromRemote', function(data){

        	// Add message to chat
			$scope.addMessage(data.message);
		});

        /**
         * Say hello to others
         * @param  {obj} user name of the user
         */
        function hello(user){

        	// Say hello to chat
        	$scope.messages.push({
        		'message' : user + ' just connect !'
        	});

        	// Display it !
        	$scope.$apply();
        }

        // Block management
         
        $scope.editMode = false;

		/**
		 * Get the template url
		 * @param  {string} type Block type
		 * @return {string} Url of the block
		 */
		$scope.getContentUrl = function(type) {
			var url = 'templates/blocks/'+Find.type(type,false)+'.html';
			return url;
		}

		// Blocks position
		$scope.blockMap = {
			sizeX: 'block.size_x',
			sizeY: 'block.size_y',
			row: 'block.pos_y',
			col: 'block.pos_x'
		};

		/**
		 * Open link in new tab
		 * @param  {string} link Url
		 */
		$scope.openLink = function(link){
			var win = window.open(link, '_blank');
			win.focus();
		}

		// Gridster configuration
		$scope.gridsterOpts = {
			columns: 3,
			margins: [0, 0],
			outerMargin: false,
			minColumns: 1,
			minRows: 2, 
			maxRows: 100,
			defaultSizeX: 1,
			defaultSizeY: 1,
			resizable: {
				enabled: false
			},
			draggable: {
				enabled: false
			}
		};

		/**
		 * On receive control from remote
		 * @param  {obj} data control detail
		 */
		Socket.on('receiveControl', function(data){

			// Control type
			switch(data.control){
				case "playVideo" :
					$scope.board.player.playVideo(); 
					break;
				case "pauseVideo" : 
					$scope.board.player.pauseVideo();
					break;
				case "setVolumeVideo" :
					$scope.board.player.setVolume(data.volume);
					break;
				case "forwardVideo" :
					$scope.board.player.seekTo($scope.board.player.getCurrentTime() + 10);
					break;
				case "backwardVideo" :
					$scope.board.player.seekTo($scope.board.player.getCurrentTime() - 10);
					break;
			}
		});

		// Init remote object
		$scope.remote = {
			connected : false,
			message : {
				content : null,
				url : null
			}
		}

		/**
		 * Add a remote
		 */
		$scope.newRemote = function(){

			// Reset messages content
			$scope.remote.message.content = null;
			$scope.remote.message.url = null;

			// If user connected
			if($scope.user){

				// Request an id
				Socket.emit('getRemoteId');

				// On respond
				Socket.on('remoteId', function(id){

					var apiKey = 'AIzaSyBXMHqtJBTRTtvtef_iI0EnkwONyP-tRRU';
		            gapi.client.setApiKey(apiKey);

		            // Get an goo.gl url with the id
		            gapi.client.load('urlshortener', 'v1', function() {
		                var request = gapi.client.urlshortener.url.insert({
		                    'resource': {
		                        'longUrl': $location.$$absUrl.split('#')[0] + 'remote/' + id
		                    }
		                });
		                var resp = request.execute(function(resp) {
		                    if (resp.error) {
		                        console.log('Error with url shortener');
		                    } else {
		                    	// Set content message
		                    	$scope.remote.message.content = "Go to :";
		                    	$scope.remote.message.url = resp.id;
		                    	// Display it
		                    	$scope.$apply();
		                    }
		                });
		            });
				});
			}
			else{
				$scope.remote.message.content = "Please, login to chat !";			
			}
		}

		/**
		 * On remote connected
		 * @param  {int} id room id
		 */
		Socket.on('connected', function(id){
			// Set room id
			$scope.roomid = id;
			// Set connected to remote
			$scope.remote.connected = true;
			// Diplay it !
			$scope.$apply();
		});

		/**
		 * On quit
		 */
		$scope.$on('$destroy', function(){
			// Disconnect the socket
			Socket.disconnect();
		});


	}]);