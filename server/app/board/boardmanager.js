var fs = require('fs');
var md5 = require('md5');
var boards_dir = './boards/';

var boardmanager = module.exports = {};

//
boardmanager.extractIdFromUrl = function(url){

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
	var match = url.match(regExp);
	if (match) if (match.length >= 2) return match[2];

}

// VALIDATOR

boardmanager.validator = {};
boardmanager.validator = function(board){

	var r=[];

	// Infos validation

	if(!board.hasOwnProperty("infos")){
		r.push("NO_INFOS");
	}else{
		if(!board.infos.hasOwnProperty("url")){
			r.push("NO_INFOS_URL");
		}
		if(!board.infos.hasOwnProperty("name")){
			r.push("NO_INFOS_NAME");
		}
		if(!board.infos.hasOwnProperty("owner_email")){
			r.push("NO_INFOS_EMAIL");
		}
		if(!board.infos.hasOwnProperty("validity")){
			r.push("NO_INFOS_VALIDITY");
		}
		if(!board.infos.hasOwnProperty("chat_enabled")){
			r.push("NO_INFOS_CHAT");
		}
	}

	// Blocks validation

	if(!board.hasOwnProperty("blocks")){
		r.push("NO_BLOCKS");
	}else{
		if(board.blocks.length>=1){
			for(var i in board.blocks){
				if(!board.blocks[i].hasOwnProperty("type")){
					r.push("NO_BLOCK_TYPE");
				}
				if(!board.blocks[i].hasOwnProperty("name")){
					r.push("NO_BLOCK_NAME");
				}
				if(!board.blocks[i].hasOwnProperty("description")){
					r.push("NO_BLOCK_DESC");
				}
				if(!board.blocks[i].hasOwnProperty("var")){
					r.push("NO_BLOCK_VAR");
				}
			}
		}else{
			r.push("NO_BLOCKS")
		}
	}

	if(r.length==0){
		r=true;
	}
	return r;
}

// TRANSFORMER

boardmanager.transformdata = function(board){
	board.infos.video_id=boardmanager.extractIdFromUrl(board.infos.url);
	return board;
}

// SAVER

boardmanager.saveboard = function(board,callback){

	var r={
		status:null,
		data:board
	};
	var validation = boardmanager.validator(board);

	if(validation===true){
		board=boardmanager.transformdata(board);
		r.status=validation;
		r.data=board;

		boardmanager.files.save(board,function(status){
			if(!status){
				r.status = "NO_ADDED_FILE_PROBLEM";
			}else{
				r.status = true;
			}

			callback(r);
		});

	}else{
		r.status=validation;
		r.data=board;

		callback(r);
	}
}

// FILES MANAGER

boardmanager.files = {};
boardmanager.files.save = function(data,callback){

	var id=md5(data);
	var fileName = data.infos.video_id+":"+id+'.json';
	console.log(fileName);
	var end_date;

	fs.writeFile(boards_dir+fileName, JSON.stringify(data), function(err) {
	    if(err) {
	        callback(false);
	    } else {
	        callback(true);
	    }
	}); 
}
