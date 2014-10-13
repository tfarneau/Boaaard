// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var request = require('request');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

var api = require('./api/api.js');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	
	// api.ted.talks({id:1},function(data){
	// 	res.json(data);
	// });

	// api.wiki.search({q:'cat'},function(data){
	// 	res.json(data);
	// })

	// api.wiki.extract({title:'cat'},function(data){
	// 	res.json(data);
	// })

	api.twitter.userTimeline({user_id:'tfarneau'},function(data){
		res.json(data);
	})

	// api.twitter.search({q:'coucou',count:20},function(data){
	// 	res.json(data);
	// })

});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);