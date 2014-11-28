app.factory('Find', function()
{
	var Find = {
		types : [
			["wiki", "type_wikipedia"],
			["twitter/userTimeline", "type_twitterfeed"],
			["twitter/search", "type_twittersearch"],
			["twitter/userInfos", "type_twitteruser"],
			["facebook/infos", "type_facebookinfos"],
			["news", "type_rssfeed"],
			["content", "type_content"],
			["image", "type_image"],
			["link", "type_link"]
		],
		type : function(invar, invert) {
			var outvar = false;
			for(var i in this.types){
			    if(!invert){
			  		if(this.types[i][0]==invar)
			  			outvar=this.types[i][1];
			    }else{
			      if(this.types[i][1]==invar)
			        outvar=this.types[i][0];
			    }
			}
			return outvar;
		}
	}

	return Find;
})