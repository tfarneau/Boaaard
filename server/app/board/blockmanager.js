var blockmanager = module.exports = {};

/**
 * Generate an URL for the block
 * @param  {obj} block : data of the block
 * @return {string}    : url of the api call to do
 */
blockmanager.generateURL = function(block){

	var url = "/api/block/"+block.type+"/"+block.var;
	return url;
	
}