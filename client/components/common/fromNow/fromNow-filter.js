app.filter('fromNow', ['$window', function ($window) {
    return function (dateString) {
        fromNow = $window.moment(new Date(dateString)).fromNow();
        return fromNow.substring(0,1).toUpperCase()+fromNow.substring(1);
    };
}]);