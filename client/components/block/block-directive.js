app.directive('block', ['Find', function(Find) {
	function link(scope, element, attrs) {
		element.addClass(Find.type(scope.block.type,false));
	}
	return {
		link: link,
		restrict: 'A'
	};
}]);