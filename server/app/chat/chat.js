// var randomWord = require('random-word');
var fs = require('fs');

var chat = module.exports = {};
var data_dir = "./data/chat/";

chat.clients = [];
chat.io = {};

chat.init = function(server){
	chat.io = server;
};

chat.listen = function(socket){ 

	this.remoteId=null;
	var that = this;

	socket.on('connectToChat',function(data){
		socket.join(data.slug);
		chat.files.get(data.slug,function(fdata){
			var send = {
				oldmessages:fdata
			};
			socket.emit('oldMessages',send);
			chat.io.sockets.in(data.slug).emit('connectedToChat',data);
			chat.files.save(data);
		})
	});

	socket.on('sendMessageToChat',function(data){
		chat.io.sockets.in(data.slug).emit('newMessageToChat',data);
		chat.files.save({
			slug:data.slug,
			message:data.message,
			pseudo:data.pseudo
		});
	});

	// socket.on('disconnect', function(){
 //        chat.io.sockets.in(slug).emit('disconnectFromChat',slug);
 //    });

}	

chat.files = {};

chat.files.save = function(data){

	var path = data_dir+data.slug+".json"
	fs.readFile(path, "utf-8", function read(err, fdata) {

		if(err){
			fdata=[];
		}else{
			fdata=JSON.parse(fdata);
		}

		fdata.push(data);

	    fs.writeFile(path, JSON.stringify(fdata), function(err) {
		    // if(err) {
		    //     callback(false);
		    // } else {
		    //     callback(true);
		    // }
		}); 

	}); 
}

chat.files.get = function(slug,callback){

	var path = data_dir+slug+".json"
	fs.readFile(path, "utf-8", function read(err, fdata){
		if(err){
			callback([]);
		}else{
			callback(JSON.parse(fdata));
		}
	}); 
}