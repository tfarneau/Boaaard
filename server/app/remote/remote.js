var randomWord = require('random-word');

var remote = module.exports = {};

remote.remotes = [];
remote.io = {};

remote.init = function(server){
	remote.io = server;
};

remote.listen = function(socket){ 

	this.remoteId=null;
	var that = this;

	socket.on('getRemoteId',function(){
		that.remoteId = randomWord();

		remote.remotes.push(that.remoteId);
		socket.emit('remoteId',that.remoteId);
		socket.join(that.remoteId);

	});

	socket.on('connectRemote',function(id){

		socket.join(id);
		remote.io.sockets.in(id).emit('connected',id);

	});

	socket.on('sendControl',function(data){
		remote.io.sockets.in(data.roomid).emit('receiveControl',data.control);
	});

	socket.on('disconnect', function () {
        for(var i = remote.remotes.length - 1; i >= 0; i--) {
			if(remote.remotes[i] === that.remoteId) {
			   remote.remotes.splice(i, 1);
			}
		}
    });

}	
