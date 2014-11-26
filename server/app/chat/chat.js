var fs = require('fs');
var chat = module.exports = {};
var data_dir = "./data/chat/";

// Clients list
chat.clients = [];
chat.io = {};

/**
 * Init chat socket
 * @param  {obj} server : io server
 */

chat.init = function(server){
	chat.io = server;
};

/**
 * Listen chat socket
 * @param  {obj} socket : opened socket
 */

chat.listen = function(socket){ 

	this.remoteId=null;
	var that = this;

	// When someone connects to chat
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

			// Join the room
			socket.join(data.slug);
			chat.clients.push(id);
			
			// Get the old messages
			chat.files.get(data.slug,function(fdata){
				var send = {
					oldmessages:fdata
				};
				socket.emit('oldMessages',send);
				chat.io.sockets.in(data.slug).emit('connectedToChat',data);
				chat.files.save(data);
			})
		}else{
			socket.emit('connectedToChat',false);
		}

	});

	// When someone send a message
	socket.on('sendMessageToChat',function(data){

		var data2 = {
			message : data.message,
			slug : data.slug,
			pseudo : data.pseudo,
			date : data.date
		};

		// Emit in the room
		chat.io.sockets.in(data.slug).emit('newMessageToChat',data2);

		// Save the data to JSON
		chat.files.save({
			slug:data.slug,
			message:data.message,
			pseudo:data.pseudo,
			date : data.date
		});
	});

	// When someone disconnect
	socket.on('disconnect', function () {
        for(var i = chat.clients.length - 1; i >= 0; i--) {
			if(chat.clients[i] === socket.clientid) {
			   chat.clients.splice(i, 1);
			}
		}
    });

}	

// Chat data management
// ====================

chat.files = {};

// Avoid buffer problems
chat.files.isSaving=false;

/**
 * Save json with history
 * @param  {obj} data : json data to save
 */

chat.files.save = function(data){

	var path = data_dir+data.slug+".json"

	if(!chat.files.isSaving){
		chat.files.isSaving=true;
		fs.readFile(path, "utf-8", function read(err, fdata) {

			if(err){
				fdata=[];
			}else{
				fdata=JSON.parse(fdata);
			}

			fdata.push(data);

		    fs.writeFile(path, JSON.stringify(fdata), function(err) {
		    	chat.files.isSaving=false;
			    // if(err) {
			    //     callback(false);
			    // } else {
			    //     callback(true);
			    // }
			}); 

		}); 
	}
}

/**
 * Get json by slug
 * @param  {string}   slug     : board slug
 * @param  {Function} callback
 */

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