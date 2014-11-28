angular
	.module('boApi')
	.factory('Api', ['$http', 'Find', function($http, Find){				
		return {
			Video : {
				// Validate url video
				validate : function(url){

					// Sanitize id video
					var id_video = url.split('v=')[1].substring(0, 11);

					return $http.get(SERVER_URL+API_URL+'validate_youtube/'+id_video);
				}
			},
			Board : {
				// Boards list
				list : function(){
					return $http.get(SERVER_URL+API_URL+"boards");
				},
				// Get one board by slug
				get : function(slug){
					return $http.get(SERVER_URL+API_URL+"boards/" + slug);
				},
				// Post a new board
				post : function(board){

					return $http({
						headers: {'Content-Type': 'application/json'}, 
						url: SERVER_URL+API_URL+"boards", 
						method: "POST", 
						data: JSON.stringify(board)
					});
		    	}
		    },
			Block : {
				// Get block
				get : function(type,req,findtype){
					if(findtype){
						type = Find.type(type,true);
					}
					return $http.get(SERVER_URL+API_URL+"block/"+type+"/"+req);
			    }
			}
		}
	}])