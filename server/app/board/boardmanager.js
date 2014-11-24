var yt = require("youtube-api");
yt.authenticate({
	type : "key",
	key : "AIzaSyD-mZVrzuCtZYngdtIH5C6bML9hs8ylxBM"
});

var slug = require('slug')
var uniqid = require('uniqid');
var fs = require('fs');
var md5 = require('md5');
var validate = require('validator');
var blockmanager = require('./blockmanager.js');
var boards_dir = './data/boards/';
var directorymanager = require('./directorymanager.js');

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
		if(!board.infos.hasOwnProperty("description")){
			r.push("NO_INFOS_DESCRIPTION");
		}
		if(!board.infos.hasOwnProperty("owner_email")){
			r.push("NO_INFOS_EMAIL");
		}
	}

	// Blocks validation

	if(!board.hasOwnProperty("blocks")){
		r.push("NO_BLOCKS");
	}else{
		if(board.blocks.length<=0){
			r.push("NO_BLOCKS");
		}else{
			for(var i in board.blocks){
				if(board.blocks[i].hasOwnProperty("type")){

					if(!board.blocks[i].hasOwnProperty("title")){
						r.push("BLOCK_NO_TITLE")
					}else{
						if(validate.trim(board.blocks[i].title)==""){
							r.push("BLOCK_EMPTY_TITLE");
						}
					}

					if(!board.blocks[i].hasOwnProperty("pos_y")){
						r.push("BLOCK_NO_POSY")
					}else{
						if(validate.trim(board.blocks[i].pos_y)==""){
							r.push("BLOCK_EMPTY_POSY");
						}
					}

					if(!board.blocks[i].hasOwnProperty("pos_x")){
						r.push("BLOCK_NO_POSX")
					}else{
						if(validate.trim(board.blocks[i].pos_x)==""){
							r.push("BLOCK_EMPTY_POSX");
						}
					}

					if(!board.blocks[i].hasOwnProperty("size_y")){
						r.push("BLOCK_NO_SIZEY")
					}else{
						if(validate.trim(board.blocks[i].size_y)==""){
							r.push("BLOCK_EMPTY_SIZEY");
						}
					}

					if(!board.blocks[i].hasOwnProperty("size_x")){
						r.push("BLOCK_NO_SIZEX")
					}else{
						if(validate.trim(board.blocks[i].size_x)==""){
							r.push("BLOCK_EMPTY_SIZEX");
						}
					}


					if(board.blocks[i].type=="content"){
						if(!board.blocks[i].content.hasOwnProperty("data")){
							r.push("BLOCK_NO_CONTENT_TEXT")
						}else{
							if(validate.trim(board.blocks[i].content.data)==""){
								r.push("BLOCK_EMPTY_CONTENT_TEXT");
							}
						}
						if(!board.blocks[i].content.hasOwnProperty("name")){
							r.push("BLOCK_NO_CONTENT_TITLE")
						}else{
							if(validate.trim(board.blocks[i].content.name)==""){
								r.push("BLOCK_EMPTY_CONTENT_NAME");
							}
						}
					}

					if(board.blocks[i].type=="link"){
						if(!board.blocks[i].content.hasOwnProperty("link")){
							r.push("BLOCK_NO_CONTENT_LINK")
						}else{
							if(validate.trim(board.blocks[i].content.link)==""){
								r.push("BLOCK_EMPTY_CONTENT_LINK");
							}
						}

						if(!board.blocks[i].content.hasOwnProperty("name")){
							r.push("BLOCK_NO_CONTENT_TITLE")
						}else{
							if(validate.trim(board.blocks[i].content.name)==""){
								r.push("BLOCK_EMPTY_CONTENT_NAME");
							}
						}
					}
					
					if(!(board.blocks[i].type=="content" || board.blocks[i].type=="link")){	
						if(!board.blocks[i].hasOwnProperty("var")){
							r.push("BLOCK_NO_VAR")
						}else{
							if(validate.trim(board.blocks[i].var)==""){
								r.push("BLOCK_EMPTY_VAR");
							}
						}
					}
					

				}else{
					r.push('BLOCK_NO_TYPE')
				}
			}
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
		if(board.blocks[i].type == 'content' || board.blocks[i].type == 'link'){

			var id = uniqid();
			board.blocks[i].var = id;
			var data = board.blocks[i];
			var type = board.blocks[i].type;

			var path = './data/blocks/'+type+'/'+id+'.json';
			fs.writeFileSync(path,JSON.stringify(data));

			delete board.blocks[i].content;
		}else{
			board.blocks[i].content=null;
		}
	}
	cb(true,board)
}

// TRANSFORMER

boardmanager.transformdata = function(board,cb){
	board.infos.video_id=boardmanager.extractIdFromUrl(board.infos.url);
	board.infos.slug=slug(board.infos.name);
	
	boardmanager.saveBlocks(board,function(status,board){
		boardmanager.validateYT(board.infos.video_id,function(data){
			if(data.data.items.length>=1){
				board.video_infos=data.data.items[0].snippet;
				cb(board);
			}else{
				board.video_infos=null;
				cb(board);
			}
		})
	});

}

// SAVER

boardmanager.saveboard = function(board,callback){

	var r={
		status:null,
		data:board
	};

	var validation = boardmanager.validator(board);
	console.log(board);

	if(validation===true){

		boardmanager.transformdata(board,function(board){
			r.status=validation;
			r.data=board;

			boardmanager.files.save(board,function(status){

				if(!status){
					r.status = "NOT_ADDED_FILE_PROBLEM";
				}else{
					r.status = true; // directorymanager
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

	directorymanager.addBoard(data);
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
