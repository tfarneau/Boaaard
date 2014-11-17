var blockmanager = module.exports = {};

blockmanager.generateURL = function(block){

	var url = "/api/blocks/"+block.type+"/"+block.var;
	return url;
	
}