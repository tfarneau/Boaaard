var randomWord = require('uniqid');
var remote = module.exports = {};

// Clients list
remote.remotes = [];
remote.io = {};

/**
 * Init remote socket
 * @param  {obj} server : io server
 */

remote.init = function(server){
	remote.io = server;
};

/**
 * Listen remote socket
 * @param  {obj} socket : opened socket
 */

remote.listen = function(socket){ 

	this.remoteId=null;
	var that = this;

	// Someone want an ID for his remote
	socket.on('getRemoteId',function(){
		that.remoteId = randomWord();
		remote.remotes.push(that.remoteId);
		socket.emit('remoteId',that.remoteId);
		socket.join(that.remoteId);
		// console.log("getRemoteId : "+that.remoteId);
	});

	// Someone wants to connecte the remote to a created room
	socket.on('connectRemote',function(id){
		// console.log("connectRemote to "+id);
		socket.join(id);
		remote.io.sockets.in(id).emit('connected',id);
	});
	
	// A control is sent to the clien
	socket.on('sendControl',function(data){

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

	// A message is sent from the remote to the client
	socket.on('sendMessageToClient',function(data){
		remote.io.sockets.in(data.roomid).emit("receiveMessageFromRemote",data);
	});

	// A message is sent to the remote
	socket.on('sendMessageToRemote',function(data){
		remote.io.sockets.in(data.roomid).emit("receiveMessageFromClient",data);
	});

	// Someone disconnect
	socket.on('disconnect', function () {
        for(var i = remote.remotes.length - 1; i >= 0; i--) {
			if(remote.remotes[i] === that.remoteId) {
			   remote.remotes.splice(i, 1);
			   socket.disconnect();
			}
		}
    });

}	
