var extractor = module.exports = {};
var request = require('request');
var api = require('./api.js');
var cache = require('../cache/cache.js');
var fs = require('fs');

// Block creator, using the api module
extractor.creator = {};

/**
 * Create user timeline block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createTwitterUserTimeline = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon,
		fromCache:false,
		content : {}
	};
	

	var d = {
		screen_name:data.q
	};

	var _cacheinfos = {
		block : 'twitter/userTimeline',
		value : data.q,
		timeValid : 0.5
	};

	cache.check(_cacheinfos.block,_cacheinfos.value,function(_cachedata){

		if(!_cachedata){

			api.twitter.getUserTimeline(d, function(data2){

				cache.write(_cacheinfos.block,_cacheinfos.value,data2,_cacheinfos.timeValid,function(r){});

				b.fromCache=false;
				b.content=data2;

		    	callback(b);
			})
			
		}else{
			b.fromCache=true;
			b.content=_cachedata;

		    callback(b);
		}
	});

}

/**
 * Create twitter search block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createTwitterSearch = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon,
		fromCache:false,
		content : {}
	};
	
	var d = {
		q : data.q
	}

	var _cacheinfos = {
		block : 'twitter/search',
		value : data.q,
		timeValid : 0.5
	};

	cache.check(_cacheinfos.block,_cacheinfos.value,function(_cachedata){

		if(!_cachedata){

			api.twitter.search(d.q, d, function(data2){

				cache.write(_cacheinfos.block,_cacheinfos.value,data2,_cacheinfos.timeValid,function(r){});

				b.fromCache=false;
				b.content=data2;

		    	callback(b);
			})
			
		}else{
			b.fromCache=true;
			b.content=_cachedata;

		    callback(b);
		}
	});

}

/**
 * Create twitter user infos block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createTwitterUserInfos = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon,
		fromCache: false,
		content : {}
	};

	var _cacheinfos = {
		block : 'twitter/userInfos',
		value : data.q,
		timeValid:0.5
	};

	cache.check(_cacheinfos.block,_cacheinfos.value,function(_cachedata){

		if(!_cachedata){

			api.twitter.showUser(data.q, function(data2){

				if(data.hasOwnProperty('profile_image_url')){
					data2.profile_image_url=data2.profile_image_url.replace('_normal','');
				}

				cache.write(_cacheinfos.block,_cacheinfos.value,data2,_cacheinfos.timeValid,function(r){});

				b.fromCache=false;
				b.content=data2;

		    	callback(b);
			})
			
		}else{
			b.fromCache=true;
			b.content=_cachedata;

		    callback(b);
		}
	});
}

/**
 * Create news block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createNewsBlock = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon,
		fromCache : false,
		content : {}
	};

	var _cacheinfos = {
		block : 'gfeednews/search',
		value : data.q,
		timeValid:24
	};

	cache.check(_cacheinfos.block,_cacheinfos.value,function(_cachedata){

		if(!_cachedata){

			api.gfeed.findFeeds(data.q, function(data2){

				cache.write(_cacheinfos.block,_cacheinfos.value,data2,_cacheinfos.timeValid,function(r){});

				b.fromCache=false;
				b.content=data2;

		    	callback(b);
			})
			
		}else{
			b.fromCache=true;
			b.content=_cachedata;

		    callback(b);
		}
	});

}

/**
 * Create wikipedia block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createWikiBlock = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon,
		fromCache : false,
		content : {}
	};

	var _cacheinfos = {
		block : 'wiki/search',
		value : data.q,
		timeValid:240
	};

	cache.check(_cacheinfos.block,_cacheinfos.value,function(_cachedata){

		var data2 = {};

		if(!_cachedata){

			api.freebase.description(data.q, {}, function(r){

				data2.desc=r;

				api.freebase.image(data.q, {}, function(r2){

					data2.img=r2;
					cache.write(_cacheinfos.block,_cacheinfos.value,data2,_cacheinfos.timeValid,function(r){});

					b.content = data2;
					b.fromCache=false;

			    	callback(b);

				});
			});

		}else{
			b.fromCache=true;
			b.content=_cachedata;

		    callback(b);
		}
	});

}

/**
 * Create facebook infos block
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

extractor.creator.createFacebookInfos = function(data,callback){

	var d = {
		id:data.q
	};

	api.facebook.api('/'+d.id,function(data2){
		callback(data2);
	});

}

/**
 * Get data for custom blocks
 * @param  {obj}   data : data to get
 * @param  {Function} callback
 */

var blocksdatapath = './data/blocks/';
extractor.creator.getContentBlock = function(data,callback){

	var path = blocksdatapath+data.type+"/"+data.q+".json";
	
	if(fs.existsSync(path)){
		fs.readFile(path, "utf-8", function read(err, data){
			callback(JSON.parse(data.toString()));
		});
	}else{
		callback({status:false,error:"NOT_FOUND"});
	}
}
