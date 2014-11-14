var extractor = module.exports = {};
var request = require('request');
var api = require('./api.js');
var cache = require('../cache/cache.js');

// BLOCKS CREATOR

extractor.creator = {};

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

extractor.creator.createFacebookInfos = function(data,callback){

	var d = {
		id:data.q
	};

	console.log(api.config.facebook);

	api.facebook.api('oauth/access_token', api.config.facebook, function(data){
		callback(data);

		// '/'+d.id+'/feed'
	});

}

// FROM TED

extractor.creator.createSpeakerBlock = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon
	};

	api.ted.speakers({id:data.id}, function(r){

		b.content=r.speaker;
		api.freebase.image(r.speaker.firstname+" "+r.speaker.lastname, {}, function(r2){
			b.content.img=r2;
			callback(b);
		});

	});

}

extractor.creator.createQuotesBlock = function(data,callback){

	var b = {
		title : data.title,
		description : data.description,
		icon : data.icon
	};

	api.ted.quotes({id:data.id}, function(r){
		b.content=r;
		callback(b);
	});

}

extractor.extractTags = function(tags){
	
	var _tags = [];
	for(var i in tags){
		if(!(tags[i].tag.indexOf('TED') > -1))
			_tags.push(tags[i].tag);
	}
	return _tags;
	
}

extractor.getBlocksFromTed = function(id,callback){

	api.ted.talks({id:id}, function(r){

		var blocks = [];

		if(r.hasOwnProperty('talk')){

			for(var i in r.talk.speakers){
				blocks.push('/block/speaker/'+r.talk.speakers[i].speaker.id);
				blocks.push('/block/quotes/'+r.talk.speakers[i].speaker.id);
				blocks.push('/block/twitter/'+r.talk.speakers[i].speaker.name);
				blocks.push('/block/news/'+r.talk.speakers[i].speaker.name);
			}

			var tags = extractor.extractTags(r.talk.tags);

			blocks.push('/block/wiki/'+tags[0]);
			blocks.push('/block/wiki/'+tags[1]);
			blocks.push('/block/wiki/'+tags[2]);
		}

		callback(blocks);
	});

}

extractor.getTedInfos = function(id,callback){

	api.ted.talks({id:id}, function(r){

		// r.tags = extractor.extractTags(r.talk.tags);
		// extractor.getPeopleInfos(r.talk.speakers[0].speaker.name, function(r2){
		// 	r.speaker=r2;

		// 	extractor.getFeeds(r.talk.speakers[0].speaker.name, function(r3){
		// 		r.feed=r3;
		// 		callback(r);
		// 	})
		// })
		
	});

};
