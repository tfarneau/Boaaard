var randomWord = require('uniqid');


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
		console.log(data);

		var send = null;
		switch(data.control) {
		    case "playVideo":
		    case "pauseVideo":
		    case "forwardVideo":
		    case "backwardVideo":
		        remote.io.sockets.in(data.roomid).emit("receiveControl",{control:data.control});
		        break;
		    case "setVolumeVideo":
		        remote.io.sockets.in(data.roomid).emit("receiveControl",{control:data.control,volume:data.volume});
		        break;
		}

		if(send!=null){
			remote.io.sockets.in(data.roomid).emit(send.e,send.data);
		}
	});

	socket.on('sendMessage',function(data){
		remote.io.sockets.in(data.roomid).emit("receiveMessage",data);
	});

	socket.on('disconnect', function () {
        for(var i = remote.remotes.length - 1; i >= 0; i--) {
			if(remote.remotes[i] === that.remoteId) {
			   remote.remotes.splice(i, 1);
			}
		}
    });

}	
