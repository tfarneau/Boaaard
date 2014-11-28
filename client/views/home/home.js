angular
	.module('boViewHome', [])
	.controller('HomeCtrl', ['$scope', '$rootScope', '$routeParams', 'Api', function($scope, $rootScope, $routeParams, Api) {

		// Display full header
		$rootScope.fullHeader = false;

		// Reset q (search)
		$rootScope.q = "";

		// Set the page title
		$rootScope.title = "Boaaard";

		// Get list of board
        Api.Board.list().then(function(result){

        	// Stock in scope
        	$scope.boards = result.data.data.slice().reverse().splice(0, 4);
        });
	}]);