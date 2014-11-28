app.directive('focus', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focus);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // element.bind('blur', function() {
      //    scope.$apply(model.assign(scope, false));
      // });
    }
  };
});