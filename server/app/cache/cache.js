var cache = module.exports = {};
var fs = require('fs');
var md5 = require('MD5');

// Cache data directory
var tmp_dir = './temp/';

/**
 * Create a timestamp from validity duration
 * @param  {int} validity : validity duration in hours
 * @return {int}          : timestamp with the end date
 */

cache.createTimestamp = function(validity){

	var timestamp = Math.round(+new Date()/1000);
	var validity = Math.round(validity*3600);
	var end_date = timestamp+validity;

	return end_date;

}

/**
 * Create a file name from the block
 * @param  {string} block : block name to save
 * @param  {obj} data     : data to save
 * @return {string}       : name of the file
 */

cache.createFilename = function(block,data){

	block = block.replace("/", "_");
	data=md5(data);
	var fileName = block+":"+data+'.json';

	return fileName;

}

/**
 * Check if a file exists
 * @param  {string}   block    : block to save name
 * @param  {data}   data       : data object
 * @param  {Function} callback
 */

cache.check = function(block,data,callback){

	var fileName = cache.createFilename(block,data);

	if (fs.existsSync(tmp_dir+fileName)) {

		fs.readFile(tmp_dir+fileName, "utf-8", function read(err, data) {
		    
		    if (err) {
		        callback(false);
		        return;
		    }

		    var _time = cache.createTimestamp(0);
		    var _data = JSON.parse(data);

		    callback(JSON.parse(data.toString()));

		    if(_time<=_data.__cache_end_date){
		    }else{
		    	fs.unlinkSync(tmp_dir+fileName);
		    }

		});

	}else{

		callback(false);

	}
}

/**
 * Write a cache content
 * @param  {string}   block    : name of the block
 * @param  {obj}   data        : main data of the block
 * @param  {obj}   content     : data to save
 * @param  {int}   validity    : validity duration in hours
 * @param  {Function} callback
 */

cache.write = function(block,data,content,validity,callback){

	var end_date;

	if(validity==0){
		end_date=0;
	}else{
		end_date=cache.createTimestamp(validity);
	}

	var fileName = cache.createFilename(block,data);

	var data_f = content;
	data_f.__cache_end_date = end_date;

	fs.writeFile(tmp_dir+fileName, JSON.stringify(data_f), function(err) {
	    if(err) {
	        callback(false);
	    } else {
	        callback(true);
	    }
	}); 

}