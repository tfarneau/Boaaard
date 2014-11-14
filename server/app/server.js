// BASE SETUP
// ==========

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var validator = require('validator');

// Express + SocketIO
var port = 3000;
var app = express();
var server = require('http').createServer(app);

app.start = app.listen = function(){
  return server.listen.apply(server, arguments)
}

// Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API
var api = require('./api/api.js');
var extractor = require('./api/extractor.js');

// REMOTE
var remote = require('./remote/remote.js');
remote.init(server);

// ROUTES FOR OUR API
// ==================

var router = express.Router();

// ROUTES : BOARDS
// ===============

var boardmanager = require('./board/boardmanager.js');

router.post('/boards', function(req, res){ 
	
	var r = boardmanager.saveboard(req.body,function(r){
		res.json(r);
	});

});

// ROUTES : BLOCKS
// ===============

router.get('/block', function(req, res) {
	res.send('/block/news/query:string<br/>/block/wiki/query:string<br/>/block/twitter/userTimeline/username:string<br/>/block/twitter/search/query:string<br/><br/>/block/speaker/id:int<br/>/block/quotes/id:int<br/>');
});

router.get('/block/wiki/:q', function(req, res) {

	extractor.creator.createWikiBlock({ 
		title : "About "+req.params.q,
		description : "What about "+req.params.q+" ?",
		type : "wiki",
		q : req.params.q
	}, function(data){
		res.json(data);
	});

});

router.get('/block/twitter/userTimeline/:q', function(req, res) {

	extractor.creator.createTwitterUserTimeline({ 
		title : req.params.q+" twitter",
		description : req.params.q+"'s twitter stream",
		type : "twitter",
		q : req.params.q
	}, function(data){
		res.json(data);
	});

});

router.get('/block/twitter/search/:q', function(req, res) {

	extractor.creator.createTwitterSearch({ 
		title : req.params.q+" twitter search",
		description : req.params.q+"'s twitter search",
		type : "twitter",
		q : req.params.q
	}, function(data){
		res.json(data);
	});

});

router.get('/block/twitter/userInfos/:q', function(req, res) {

	extractor.creator.createTwitterUserInfos({ 
		title : req.params.q+" twitter account",
		description : req.params.q+"'s twitter account",
		type : "twitter",
		q : req.params.q
	}, function(data){
		res.json(data);
	});

});

router.get('/block/facebook/feed/:q', function(req, res) {

	extractor.creator.createFacebookInfos({ 
		title : "Facebook feed",
		description : "Facebook feed",
		type : "twitter",
		q : req.params.q
	}, function(data){
		res.json(data);
	});

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.start(port);
console.log("Server started on "+port);