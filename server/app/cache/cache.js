var cache = module.exports = {};
var fs = require('fs');
var md5 = require('MD5');

var tmp_dir = './temp/';

cache.createTimestamp = function(validity){

	var timestamp = Math.round(+new Date()/1000);
	var validity = Math.round(validity*3600);
	var end_date = timestamp+validity;

	return end_date;

}

cache.createFilename = function(block,data){

	block = block.replace("/", "_");
	data=md5(data);
	var fileName = block+":"+data+'.json';

	return fileName;

}

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
		    	console.log('valid');
		    }else{
		    	console.log('expired, deleting');
		    	fs.unlinkSync(tmp_dir+fileName);
		    }

		});

	}else{

		callback(false);

	}
}

cache.write = function(block,data,content,validity,callback){

	var end_date;

	if(validity==0){
		end_date=0;
	}else{
		end_date=cache.createTimestamp(validity);
	}

	var fileName = cache.createFilename(block,data);

	var data_f = {
		__cache_end_date:end_date,
		content:content
	};

	fs.writeFile(tmp_dir+fileName, JSON.stringify(data_f), function(err) {
	    if(err) {
	        callback(false);
	    } else {
	        callback(true);
	    }
	}); 

}