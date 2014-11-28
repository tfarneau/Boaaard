angular
    .module('boSocket')
    .factory('Socket', ['$rootScope', function($rootScope){
        var socket = io.connect(SERVER_URL);
        return {
            // On event
            on: function (eventName, data, callback) {
                socket.on(eventName, data, function () {  
                    $rootScope.$apply(function () {
                        callback.apply(socket, arguments);
                    });
                });
            },
            // Emit event
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    $rootScope.$apply(function () {
                        if(callback) {
                            callback.apply(socket, arguments);
                        }
                    });
                })
            },
            // Remove all listeners
            removeAllListeners: function(eventName, callback){
                socket.removeAllListeners(eventName, function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket, args);
                    });
                });
            },
            // Disconnect socket
            disconnect: function(){
                socket.disconnect();
            },
            // Connect socket
            connect: function(){
                socket.connect();
            }
        };
    }])