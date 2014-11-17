var yt = require("youtube-api");
yt.authenticate({
	type : "key",
	key : "AIzaSyD-mZVrzuCtZYngdtIH5C6bML9hs8ylxBM"
});

var slug = require('slug')
var uniqid = require('uniqid');
var fs = require('fs');
var md5 = require('md5');
var blockmanager = require('./blockmanager.js');
var boards_dir = './data/boards/';

var boardmanager = module.exports = {};

//
boardmanager.extractIdFromUrl = function(url){

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
	var match = url.match(regExp);
	if (match) if (match.length >= 2) return match[2];

}

// VALIDATOR

boardmanager.validator = {};

boardmanager.validateYT = function(id,cb){

	yt.videos.list({
	    "id": id,
	    "maxResults": 1,
	    "part" : "id,snippet"
	}, function (err, data) {

		var r = {
			status : ['NOT_FOUND'],
			data : {}
		};

		if(data){
			if(data.pageInfo.totalResults>=1){
				r.status = true;
			}
			r.data=data;
		}else{
			r.data=err;
		}

	    cb(r);
	});
}
// boardmanager.validateYT(board.infos.video_id);

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
				if(board.blocks[i].hasOwnProperty('data')){
					if(!board.blocks[i].hasOwnProperty("type")){
						r.push("NO_BLOCK_TYPE");
					}

					// Set type
					board.blocks[i].data.type=board.blocks[i].type;

					if(!board.blocks[i].data.hasOwnProperty("name")){
						r.push("NO_DATA_BLOCK_NAME");
					}
					if(!board.blocks[i].data.hasOwnProperty("description")){
						r.push("NO_DATA_BLOCK_DESC");
					}
					if(!board.blocks[i].data.hasOwnProperty("data")){
						r.push("NO_DATA_BLOCK_DATA");
					}
				}else{
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

// GETTER

boardmanager.getBoard = function(slug,callback){

	var path = boards_dir+"/"+slug+".json";

	if(fs.existsSync(path)){
		fs.readFile(path, "utf-8", function read(err, data){
			data = JSON.parse(data);

			for(var i in data.blocks){
				data.blocks[i].url=blockmanager.generateURL(data.blocks[i]);
			}

			callback({status:true,data:data});
		});
	}else{
		callback({status:["NOT_FOUND"],data:null});
	}
}

// SAVE BLOCKS

boardmanager.saveBlocks = function(board,cb){
	for(var i in board.blocks){
		if(board.blocks[i].hasOwnProperty('data')){

			var id = uniqid();
			board.blocks[i].var = id;
			var data = board.blocks[i].data;
			var type = board.blocks[i].type;

			var path = './data/blocks/'+type+'/'+id+'.json';
			fs.writeFileSync(path,JSON.stringify(data));

			delete board.blocks[i].data;
		}
	}
	cb(true,board)
}

// TRANSFORMER

boardmanager.transformdata = function(board,cb){
	board.infos.video_id=boardmanager.extractIdFromUrl(board.infos.url);
	boardmanager.saveBlocks(board,function(status,board){
		cb(board);
	})
}

// SAVER

boardmanager.saveboard = function(board,callback){

	var r={
		status:null,
		data:board
	};

	var validation = boardmanager.validator(board);

	if(validation===true){

		boardmanager.transformdata(board,function(board){
			r.status=validation;
			r.data=board;

			boardmanager.files.save(board,function(status){
				if(!status){
					r.status = "NOT_ADDED_FILE_PROBLEM";
				}else{
					r.status = true;
				}

				callback(r);
			});
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

	var id=slug(data.infos.name);
	var fileName = id+'.json';
	var end_date;

	var path = boards_dir+fileName;
	if (!fs.existsSync(path)) {
	    fs.writeFile(path, JSON.stringify(data), function(err) {
		    if(err) {
		        callback(false);
		    } else {
		        callback(true);
		    }
		}); 
	}else{
		callback(false);
	}
}
