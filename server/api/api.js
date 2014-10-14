var api = module.exports = {};
var request = require('request');

// API configuration

api.config = {
	ted : {
		key : "qhzk7c4fuztg8zmenbk6uvww",
		url : "http://api.ted.com/v1/"
	},
	wiki : {
		url : "http://en.wikipedia.org/w/api.php"
	},
	twitter : {
		url : "https://api.twitter.com/1.1/",
		app : {
			consumer_key: 'fIpWbpGVowO5EEh8nw6zQwTZV',
		    consumer_secret: 'lfxbCkA69jdCzQuhHF9Cewv3ZVuixGjUrS2CkPhOEVutsxRK9e',
		    access_token_key: '182000225-2Y0gSsZYk14BA1M22sUKjFzHVxge94yUlsAYbSSa',
		    access_token_secret: '9Ud2tVAIGhQJn7BSvwteoAPhH8Ro4xO67mBdW49Fo4CkD'
		}
	},
	google : {
		key : "AIzaSyAhE4dy6-EBZ2uxj7ajkvf0YOn9OFK-8_c"
	}
};

function convertToParams(params){
	var s="?";

	for(var i in params){
		s+=i+"="+params[i]+"&";
	}

	s = s.substring(0, s.length - 1);

	return s;
}
function first(obj) {
    for (var a in obj) return obj[a];
}

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/
/*												*/
/*						TED						*/
/*												*/
/*	Endpoints :									*/
/*	-----------									*/
/*												*/
/*	api.ted.talks								*/
/*	api.ted.countries							*/
/*	api.ted.events								*/
/*	api.ted.languages							*/
/*	api.ted.quotes								*/
/*	api.ted.ratings								*/
/*	api.ted.rating_words						*/
/*	api.ted.speakers							*/
/*	api.ted.states								*/
/*	api.ted.tedx_events							*/
/*	api.ted.tedx_groups							*/
/*	api.ted.tedx_speakers						*/
/*	api.ted.tedx_venues							*/
/*	api.ted.speakers							*/
/*												*/
/*	Main structure :							*/
/*	----------------							*/
/*												*/
/*	fn(params,callback) 						*/
/*												*/
/*	Params :									*/
/*	--------									*/
/*	     										*/
/*	id (int)									*/
/*	limit (int)									*/
/*	offset (int)								*/
/*												*/
/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

api.ted={};

api.ted.createRequest = function(name,data,callback){

	if(data==null){
		data={};
	}

	var params={
		// 'callback':'JSON_CALLBACK',
		'api-key':api.config.ted.key
	};

	for(var i in data){
		params[i]=data[i];
	}

	params = convertToParams(params);


	if(data.hasOwnProperty('id')){

		request({
			uri : api.config.ted.url+name+"/"+parseInt(data.id)+".json"+params,
			method : "GET"
		}, function(e,r,b){
			callback(JSON.parse(b));
		});
		
	}else{

		request({
			uri : api.config.ted.url+name+".json"+params,
			method : "GET"
		}, function(e,r,b){
			callback(JSON.parse(b));
		});

	}

  	return request;
}

api.ted.talks = function(data,callback){ return(api.ted.createRequest('talks',data,callback)); };
api.ted.countries = function(data,callback){ return(api.ted.createRequest('countries',data,callback)); };
api.ted.events = function(data,callback){ return(api.ted.createRequest('events',data,callback)); };
api.ted.languages = function(data,callback){ return(api.ted.createRequest('languages',data,callback)); };
api.ted.quotes = function(data,callback){ return(api.ted.createRequest('quotes',data,callback)); };
api.ted.ratings = function(data,callback){ return(api.ted.createRequest('ratings',data,callback)); };
api.ted.rating_words = function(data,callback){ return(api.ted.createRequest('rating_words',data,callback)); };
api.ted.speakers = function(data,callback){ return(api.ted.createRequest('speakers',data,callback)); };
api.ted.states = function(data,callback){ return(api.ted.createRequest('states',data,callback)); };
api.ted.tedx_events = function(data,callback){ return(api.ted.createRequest('tedx_events',data,callback)); };
api.ted.tedx_groups = function(data,callback){ return(api.ted.createRequest('tedx_groups',data,callback)); };
api.ted.tedx_speakers = function(data,callback){ return(api.ted.createRequest('tedx_speakers',data,callback)); };
api.ted.tedx_venues = function(data,callback){ return(api.ted.createRequest('tedx_venues',data,callback)); };

// TODO
api.ted.themes = function(data,callback){ return(api.ted.createRequest('themes',data,callback)); };
api.ted.playlists = function(data,callback){ return(api.ted.createRequest('playlists',data,callback)); };
api.ted.search = function(data,callback){ return(api.ted.createRequest('search',data,callback)); };

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/
/*												*/
/*						WIKI					*/
/*												*/
/*	Endpoints :									*/
/*	-----------									*/
/*												*/
/*	api.wiki.extracts							*/
/*	api.wiki.search								*/						
/*												*/
/*	Main structure :							*/
/*	----------------							*/
/*												*/
/*	fn(params,callback) 						*/
/*												*/
/*	Params :									*/
/*	--------									*/
/*	     										*/
/*	title (string)								*/
/*	q (string)									*/
/*	limit (int)									*/
/*												*/
/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

api.wiki={};

api.wiki.extract = function(data,callback){

	if(data==null)
		data={};

	var title='';
	if(data.hasOwnProperty('title'))
		title=data.title;

	var params = {
		action:'query',
		titles:title,
		prop:'extracts',
		exchars:1000,
		format:'json'
	};

	params=convertToParams(params);

	request({
		uri : api.config.wiki.url+params,
		method : "GET"
	}, function(e,r,b){
		callback(api.wiki.format.extract(JSON.parse(b)));
	});

};

api.wiki.search = function(data,callback){

	if(data==null)
		data={};

	var q='';
	var limit=5;

	if(data.hasOwnProperty('q'))
		q=data.q;

	if(data.hasOwnProperty('limit'))
		limit=data.limit;

	var params = {
		action:'opensearch',
		search:q,
		limit:limit,
		namespace:0,
		format:'json'
	};

	params=convertToParams(params);

	request({
		uri : api.config.wiki.url+params,
		method : "GET"
	}, function(e,r,b){
		callback(JSON.parse(b));
	});

};

api.wiki.format={};
api.wiki.format.extract = function(data){

	var txt = first(data.query.pages).extract;
	// Split at first title
	txt=txt.split('<h');
	txt=txt[0];
	// Replace HTML
	txt = txt.replace(/<(?:.|\n)*?>/gm, '');

	return {
		title:first(data.query.pages).title,
		pageid:first(data.query.pages).pageid,
		txt:txt
	};
};

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/
/*												*/
/*					TWITTER						*/
/*												*/
/*	Endpoints :									*/
/*	-----------									*/
/*												*/
/*	api.twitter.search							*/					
/*												*/
/*	Main structure :							*/
/*	----------------							*/
/*												*/
/*	fn(params,callback) 						*/
/*												*/
/*	Params :									*/
/*	--------									*/
/*	     										*/
/*	q (string)									*/
/*	count (int)									*/
/*	result_type (string)						*/
/*	include_rts (boolean)						*/
/*												*/
/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

var twitter = require('twitter');
var twit = new twitter(api.config.twitter.app);

api.twitter={};

api.twitter.search = function(data,callback){

	if(!data.hasOwnProperty('q')){
		callback({error:'NODATA'});
		return false;
	}

	twit.search(data.q, data, function(data) {
	    callback((data));
	});
}

api.twitter.userTimeline = function(data,callback){

	if(!data.hasOwnProperty('user_id')){
		callback({error:'NODATA'});
		return false;
	}

	twit.getUserTimeline(data, function(data) {
	    callback((data));
	});
}

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/
/*												*/
/*					Freebase					*/
/*												*/
/*	https://www.npmjs.org/package/freebase		*/
/*												*/
/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/*/

var freebase= require('freebase');

api.freebase = freebase;

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
/*												 */
/*					Google Feeds				 */
/*												 */
/* https://www.npmjs.org/package/google-feed-api */
/*												 */
/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/

var gfeed = require('google-feed-api');

api.gfeed = gfeed;
