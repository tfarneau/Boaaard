var directorymanager = module.exports = {};
var fs = require('fs');

/**
 * Add a board to the directory
 * @param {data} data : board data to add
 */

directorymanager.addBoard = function(data){

	var send = {
		title : data.infos.name,
		slug : data.infos.slug,
		video_id : data.infos.video_id,
		posters : data.video_infos.thumbnails
	};

	var path = './data/directory.json';
	fs.readFile(path, "utf-8", function read(err, fdata) {

		if(err){
			fdata=[];
		}else{
			fdata=JSON.parse(fdata);
		}

		fdata.push(send);

	    fs.writeFile(path, JSON.stringify(fdata), function(err){}); 

	}); 

}

/**
 * Get boards data
 * @param  {Function} callback [description]
 */

directorymanager.getBoards = function(callback){

	var path = './data/directory.json';

	fs.readFile(path, "utf-8", function read(err, data){
		data = JSON.parse(data);

		for(var i in data.blocks){
			data.blocks[i].url=blockmanager.generateURL(data.blocks[i]);
		}

		callback({status:true,data:data});
	});
}