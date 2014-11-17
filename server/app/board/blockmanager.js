var blockmanager = module.exports = {};

blockmanager.generateURL = function(block){

	var url = "/api/block/"+block.type+"/"+block.var;
	return url;
	
}