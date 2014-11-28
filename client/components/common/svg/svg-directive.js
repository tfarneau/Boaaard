app.directive('includeSvg', function(){
    return function(scope, element, attrs){        
        SVGInjector(element);
    };
});