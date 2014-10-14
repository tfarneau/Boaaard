var API = angular.module('api',[]);

API.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


var configs = {
	ted : {
		key : "qhzk7c4fuztg8zmenbk6uvww",
		url : "http://api.ted.com/v1/"
	},
	wiki : {
		url : "http://en.wikipedia.org/w/api.php"
	},
	twitter : {
		url : "https://api.twitter.com/1.1/"
	}
};

// AJAX callbacks
function handleError(response){
  return response;
}

function handleSuccess(response){
  return response.data;
}

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

/* ----
TED API
------*/

API.factory('Ted',[ '$http', function($http){

	function createTedRequest(name,data){
		var request;
		if(data==null){
			data={};
		}

		var params={
			'callback':'JSON_CALLBACK',
			'api-key':configs.ted.key
		};

		for(var i in data){
			params[i]=data[i];
		}

		params = convertToParams(params);

    	if(data.hasOwnProperty('id')){
    		request = $http.jsonp(configs.ted.url+name+"/"+parseInt(data.id)+".json"+params);
    	}else{
    		request = $http.jsonp(configs.ted.url+name+".json"+params);
    	}

      	return request;
	}

    return {

    	// id,limit,offset
        talks: function(data){ return(request.then(createTedRequest('talks',data),handleError)); },
        countries: function(data){ return(createTedRequest('countries',data).then(handleSuccess,handleError)); },
        events: function(data){ return(createTedRequest('events',data).then(handleSuccess,handleError)); },
        languages: function(data){ return(createTedRequest('languages',data).then(handleSuccess,handleError)); },
        quotes: function(data){ return(createTedRequest('quotes',data).then(handleSuccess,handleError)); },
        ratings: function(data){ return(createTedRequest('ratings',data).then(handleSuccess,handleError)); },
        rating_words: function(data){ return(createTedRequest('rating_words',data).then(handleSuccess,handleError)); },
        speakers: function(data){ return(createTedRequest('speakers',data).then(handleSuccess,handleError)); },
        states: function(data){ return(createTedRequest('states',data).then(handleSuccess,handleError)); },
        tedx_events: function(data){ return(createTedRequest('tedx_events',data).then(handleSuccess,handleError)); },
        tedx_groups: function(data){ return(createTedRequest('tedx_groups',data).then(handleSuccess,handleError)); },
        tedx_speakers: function(data){ return(createTedRequest('tedx_speakers',data).then(handleSuccess,handleError)); },
        tedx_venues: function(data){ return(createTedRequest('tedx_venues',data).then(handleSuccess,handleError)); },
        
        talks: function(data){ return(createTedRequest('talks',data).then(handleSuccess,handleError)); },
        themes: function(data){ return(createTedRequest('themes',data).then(handleSuccess,handleError)); },
        playlists: function(data){ return(createTedRequest('playlists',data).then(handleSuccess,handleError)); },

        // q, category
        search: function(data){ return(createTedRequest('search',data).then(handleSuccess,handleError)); },

    };
}]);

/* ----
Wiki API
------*/

API.factory('Wiki',[ '$http', function($http){

    return {
        extract: function(data){

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
        		format:'json',
        		callback:'JSON_CALLBACK'
        	};

        	params=convertToParams(params);
			request = $http.jsonp(configs.wiki.url+params);

          	return(request.then(handleSuccess,handleError));

        },
        search: function(data){

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
        		format:'json',
        		callback:'JSON_CALLBACK'
        	};

        	params=convertToParams(params);
			request = $http.jsonp(configs.wiki.url+params);

          	return(request.then(handleSuccess,handleError));

        },
        format:{
        	extract: function(data){

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
        	}
        }

    };
}]);

/* Twitter API 
------------*/

API.factory('Twitter',[ '$http', function($http){

    return {
        search: function(data){

        	if(data==null)
				data={};

			var q='';
			if(data.hasOwnProperty('q'))
				q=data.q;

        	var params = {
        		result_type:'popular',
        		q:q,
        		count:100,
        		callback:'JSON_CALLBACK'
        	};

        	params=convertToParams(params);
			request = $http.jsonp(configs.twitter.url+"search/tweets.json");

          	return(request.then(handleSuccess,handleError));

        }
    };
}]);

API.controller('test', ['Ted','Wiki','Twitter', function (Ted,Wiki,Twitter) {

	// Ted.talks().then(
	// 	function(data) {
	// 		console.log(data);
	// 	}
	// );

	Twitter.search({q:'test'}).then(
		function(data) {
			console.log(data);
		}
	);

	// Wiki.extract({title:'animal'}).then(
	// 	function(data) {
	// 		var txt = Wiki.format.extract(data);
	// 		console.log(txt);
	// 	}
	// );

}]);