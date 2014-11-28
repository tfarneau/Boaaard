var app = angular.module('App', [

    // Dependencies
    'ngRoute',
    'LocalStorageModule',
    'youtube-embed',
    'perfect_scrollbar',
    'gridster',

    // Views
    'boViewHome',
    'boViewSearch',
    'boViewCreate',
    'boViewBoard',

    // Components
    'boApi',
    'boSocket'
    // 'base_Component2',
    // 'base_Component3'
])

// App config
.config(['$routeProvider', 'localStorageServiceProvider', '$httpProvider', function($routeProvider, localStorageServiceProvider, $httpProvider) {
    
    // Local storage prefixer
    localStorageServiceProvider.setPrefix('_bo');

    // Cross domain authorization
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Routes list
    $routeProvider
        // Home
        .when('/', {
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl'
        })
        // Search
        .when('/search/:q?', {
            templateUrl: 'views/search/search.html',
            controller: 'SearchCtrl'
        })
        // Create board
        .when('/create', {
            templateUrl: 'views/create/create.html',
            controller: 'CreateCtrl'
        })
        // Create board with extension
        .when('/create/:url?', {
            templateUrl: 'views/create/create.html',
            controller: 'CreateCtrl'
        })
        // Board
        .when('/board/:slug', {
            templateUrl: 'views/board/board.html',
            controller: 'BoardCtrl'
        })
        .otherwise({redirectTo:'/'});

}])

// Main controller
.controller('AppCtrl', ['$scope', '$rootScope', 'localStorageService', function($scope, $rootScope, localStorageService) {
    $rootScope.title = "Boaaard";
}])

// App run
.run(['$route', '$rootScope', '$location', 'Socket', function($route, $rootScope, $location, Socket) {

    var history = [];

    // History push
    $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    // Previous page method
    $rootScope.back = function (reload) {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl, reload);
    };

    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);

// Global API variables
// 
var SERVER_URL = "http://hetic.192.168.0.11.xip.io:3000";
// var SERVER_URL = "http://10.30.2.64:3000";
// var SERVER_URL = "http://10.30.2.143:3000";
var API_URL = "/api/";