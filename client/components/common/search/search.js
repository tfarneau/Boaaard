app.controller('qCtrl', ['$scope', '$rootScope', '$window', '$location', '$timeout', function($scope, $rootScope, $window, $location, $timeout){

	/**
	 * Search a board
	 */
	$scope.search = function() {

		// Set rootscope q search
		$rootScope.q = $scope.q;

		// If q not empty
		if($rootScope.q.trim().length > 0){
			$scope.isSubmit = true;
			// Launch search
			$timeout(function(){
				$location.path('/search/' + $scope.q, true);
			}, 650);
		}
	}

	/**
	 * On q change
	 * @param  {string} q Search text
	 */
	$scope.qChange = function(q) {

		// Set rootscope q search
		$rootScope.q = q;

		// Change url
		$location.path('/search/' + $scope.q, false);
	}

}]);