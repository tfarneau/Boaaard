angular
	.module('boViewSearch', [])
	.controller('SearchCtrl', ['$scope', '$rootScope', '$routeParams', 'Api', function($scope, $rootScope, $routeParams, Api) {

		// Display full header
		$rootScope.fullHeader = true;

		// Send q param url to rootScope
		$rootScope.q = $routeParams.q;

		// Set the page title
		$rootScope.title = "Boaaard - " + $rootScope.q;

		// Get board list
		Api.Board.list().then(function(result){
			// Stock in scope
        	$scope.boards = result.data.data;
        });
	}]);