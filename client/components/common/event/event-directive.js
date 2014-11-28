app.directive('event', ['$window', '$timeout', function ($window, $timeout) {
    return function(scope, element, attrs) {

        var w = angular.element($window);
    	var b = angular.element('body');
        
        function setMarginLeft(){
            angular.element('.margin-over').css('marginLeft', (b.width() - angular.element('.l-container').width())/2);
            $timeout(function() {
                scope.$apply();
            });
        }        

        w.bind('resize', function() {
            setMarginLeft();
        });

        scope.$watch(function(){
            return b.height();
        }, function(value) {
    		setMarginLeft();
        });

        w.bind('scroll', function() {
            scope.$apply();
        });
    };
}]);