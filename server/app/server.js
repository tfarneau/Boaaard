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
app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API
var api = require('./api/api.js');
var extractor = require('./api/extractor.js');

// REMOTE
var remote = require('./remote/remote.js');

// CHAT
var chat = require('./chat/chat.js');

// SocketIO components
var ioserver = require('socket.io')(server);

// Remote & chat initialization
remote.init(ioserver);
chat.init(ioserver);

ioserver.on('connection',remote.listen);
ioserver.on('connection',chat.listen);

// Enable CORS for Angular

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next(); 
});

// ROUTES
// ======

var router = express.Router();

// ROUTES : BOARDS
// ===============

var boardmanager = require('./board/boardmanager.js');
var directorymanager = require('./board/directorymanager.js');

// Validate a youtuve video and get content
router.get('/validate_youtube/:video_id', function(req, res){ 

	var r = boardmanager.validateYT(req.param('video_id'),function(r){
		res.json(r);
	});

});

// Get a board by slug
router.get('/boards/:slug', function(req, res){ 
	
	var r = boardmanager.getBoard(req.params.slug,function(r){
		res.json(r);
	});

});

// Get the board's list
router.get('/boards', function(req, res){ 
	
	var r = directorymanager.getBoards(function(r){
		res.json(r);
	});

});

// Add a board
router.post('/boards', function(req, res){ 
	
	var data = req.body;
	var r = boardmanager.saveboard(req.body,function(r){
		res.json(r);
	});

});

// ROUTES : BLOCKS
// ===============

// Wikipedia block
router.get('/block/wiki/:q', function(req, res) {

	extractor.creator.createWikiBlock({ 
		title : "About "+req.params.q,
		description : "What about "+req.params.q+" ?",
		type : "wiki",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// User twitter timeline block
router.get('/block/twitter/userTimeline/:q', function(req, res) {

	extractor.creator.createTwitterUserTimeline({ 
		title : req.params.q+" twitter",
		description : req.params.q+"'s twitter stream",
		type : "twitter/userTimeline",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// Twitter search block
router.get('/block/twitter/search/:q', function(req, res) {

	extractor.creator.createTwitterSearch({ 
		title : req.params.q+" twitter search",
		description : req.params.q+"'s twitter search",
		type : "twitter/search",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// Twitter user infos block
router.get('/block/twitter/userInfos/:q', function(req, res) {

	extractor.creator.createTwitterUserInfos({ 
		title : req.params.q+" twitter account",
		description : req.params.q+"'s twitter account",
		type : "twitter/userInfos",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// Facebook infos block
router.get('/block/facebook/infos/:q', function(req, res) {

	extractor.creator.createFacebookInfos({ 
		title : "Facebook infos",
		description : "Facebook infos",
		type : "facebook/infos",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// RSS news block
router.get('/block/news/:q', function(req, res) {

	extractor.creator.createNewsBlock({ 
		title : "News about "+req.params.q,
		description : "Some news about "+req.params.q+" ?",
		type : "news",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// Custom content block
router.get('/block/content/:q', function(req, res) {

	extractor.creator.getContentBlock({ 
		type : "content",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});

// Fix for image block
router.get('/block/image/:q', function(req, res) {
	res.json({status:true,data:null});
});

// Custom link block
router.get('/block/link/:q', function(req, res) {

	extractor.creator.getContentBlock({ 
		type : "link",
		q : req.params.q
	}, function(data){
		res.json({status:true,data:data});
	});

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);

// START THE SERVER
// =============================================================================

app.start(port);

// Magic message !
console.log(" _                                     _ ");
console.log("| |                                   | |");
console.log("| |__   ___   __ _  __ _  __ _ _ __ __| |");
console.log("| '_ \\ / _ \\ / _` |/ _` |/ _` | '__/ _` |");
console.log("| |_) | (_) | (_| | (_| | (_| | | | (_| |");
console.log("|_.__/ \\___/ \\__,_|\\__,_|\\__,_|_|  \\__,_|");
console.log(" ");
console.log("Server listening on "+port);