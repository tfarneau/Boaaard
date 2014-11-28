app.directive('focusNext', function() {
  return {
    restrict: 'A',
    link: function(scope,elem,attrs) {
      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          var next = elem.next();
          if(next.length > 0)
            next.focus();
          else
            elem.blur();
        }
      });
    }
  }
});