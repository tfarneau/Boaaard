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

		var id = data.pseudo+"-"+data.slug;
		var status = true;
		for(var i in chat.clients){
			if(chat.clients[i]==id){
				status = false;
			}
		}

		if(status){
			socket.clientid=id;
			socket.join(data.slug);
			chat.clients.push(id);
			chat.files.get(data.slug,function(fdata){
				var send = {
					oldmessages:fdata
				};
				chat.io.sockets.in(data.slug).emit('connectedToChat',data);
				socket.emit('oldMessages',send);
				chat.files.save(data);
			})
		}else{
			chat.io.sockets.in(data.slug).emit('connectedToChat',false);
		}

		console.log(chat.clients);

	});

	socket.on('sendMessageToChat',function(data){

		var data2 = {
			message : data.message,
			slug : data.slug,
			pseudo : data.pseudo,
			date : data.date
		};

		chat.io.sockets.in(data.slug).emit('newMessageToChat',data2);

		chat.files.save({
			slug:data.slug,
			message:data.message,
			pseudo:data.pseudo,
			date : data.date
		});
	});

	socket.on('disconnect', function () {
        for(var i = chat.clients.length - 1; i >= 0; i--) {
			if(chat.clients[i] === socket.clientid) {
			   chat.clients.splice(i, 1);
			}
		}
		console.log(chat.clients);
    });

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