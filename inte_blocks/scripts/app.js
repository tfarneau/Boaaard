// Main app
var App = angular.module('App', ['gridster','perfect_scrollbar']);

// GLOBALS VARIABLES AND CONFIG

var SERVER_URL = "http://localhost:3000/api/";

App.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

///////////////////////////
// A METTRE DANS UN SERVICE
///////////////////////////

function findType(invar,invert){

	var types = [
		["wiki", "type_wikipedia"],
		["twitter/userTimeline", "type_twitterfeed"],
		["twitter/search", "type_twittersearch"],
		["twitter/userInfos", "type_twitteruser"],
		["facebook/infos", "type_facebookinfos"],
		["news", "type_rssfeed"],
		["content", "type_content"],
		["image", "type_image"],
		["link", "type_link"]
	];

	var outvar = false;
	for(var i in types){
    if(!invert){
  		if(types[i][0]==invar)
  			outvar=types[i][1];
    }else{
      if(types[i][1]==invar)
        outvar=types[i][0];
    }
	}
	return outvar;
}

//////////
// FILTERS
//////////

App.filter('htmlToPlaintext', function() {
  return function(text) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = text;
    return tmp.textContent || tmp.innerText || "";
  }
});

//////////
// FACTORY
//////////

App.factory('Api', ['$http', function($http) {

  var Api = {};
  Api.Blocks = {
    get : function(type,req,findtype){
      if(findtype){
        type=findType(type,true);
      }
      return $http.get(SERVER_URL+"block/"+type+"/"+req);
    }
  };

  Api.Boards = {
    post : function(data){

      var board = {};
      board.blocks = data;

      ///////
      // ADD INFOS HERE
      ///////

      board.infos = {
        url : "http://www.youtube.com/watch?v=wfpL6_0OBuA",
        description : "testazeazezae azeaze azeaz eaz e az lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, aliquid quae tempora eveniet deleniti. Odio, tenetur, fugit, animi voluptates ratione itaque asperiores id sit quas quod quos non placeat ab.",
        owner_email : "test@gmail.com"
      };

      // console.log(board);
      return $http({
        headers: {'Content-Type': 'application/json'}, 
        url: SERVER_URL+"boards", 
        method: "POST", 
        data: JSON.stringify(board)
      });
    },
    get : function(slug){
      return $http.get(SERVER_URL+"boards/"+slug);
    }
  }
  
  return Api;
}]);

//////////////
// DIRECTIVES
//////////////

App.directive('blockspinner', function() {

  return {
    restrict: 'E',
    template: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
  };

});

App.directive('block', function() {

  function link(scope, element, attrs) {
  	element.addClass(findType(scope.block.type,false));
  }

  return {
    link: link,
    restrict: 'A'
  };
});

App.directive('bgImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('bgImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});

/////////////
// CONTROLLER
/////////////

App.controller('ShowCtrl', ['$scope','Api', function($scope,Api) {

  $scope.editMode=false;

  Api.Boards.get('test-2').then(function(results){
    var blocks = results.data.data.blocks;
    $scope.blocks=results.data.data.blocks;

    function checkBlocks(i){
      if(typeof blocks[i] != "undefined"){

        if(blocks[i].type!="image"){
          console.log(blocks[i].url);
          Api.Blocks.get(blocks[i].type,blocks[i].var,false).then(function(results){
            $scope.blocks[i].content=results.data.data.content;
            console.log(results.data.data.content);
            console.log("OUT");
          });
        }

        checkBlocks(i+1);

      }else{

      }
    }

    checkBlocks(0);

  });

  $scope.focusInput = function(){
    $(this).focus();
  }

  var types = [];
  $scope.getContentUrl = function(type) {
    var url = 'templates/blocks/'+findType(type,false)+'.html';
    return url;
  }

  $scope.blockMap = {
    sizeX: 'block.size_x',
      sizeY: 'block.size_y',
      row: 'block.pos_y',
      col: 'block.pos_x'
  };

  $scope.openLink = function(link){
    var win = window.open(link, '_blank');
    win.focus();
  }

   $scope.gridsterOpts = {
      columns: 3,
      margins: [0, 0],
      outerMargin: false,
      minColumns: 1,
      minRows: 2, 
      maxRows: 100,
      defaultSizeX: 1,
      defaultSizeY: 1,
      resizable: {
         enabled: false,
      },
      draggable: {
         enabled: false, // whether dragging items is supported
      }
  };
}]);

App.controller('MainCtrl', ['$scope','Api', function($scope,Api) {

    $scope.editMode=true;

    $scope.onChevre = function(index){
      if($scope.blocks[index].var=="chevre"){
        $scope.blocks[index].var = "http://idata.over-blog.com/3/56/02/16/2010-08/Chevre-yeux.jpg";
        $scope.blocks[index].isEdit = false;
      }
    }

    // Injector
    var mySVGsToInject = document.querySelectorAll('img.icon');
    SVGInjector(mySVGsToInject);

    $scope.addBlock = function(type){
      type=findType(type,true);
      $scope.addBlockOpened=false;
      $scope.blocks.push({ type: type, title: "Block title", isEdit: true });
    };

    $scope.deleteBlock = function(index){
      $scope.blocks.splice(index, 1);
    }

    $scope.addBlockOpened=false;

    $scope.exportBoard = function(){
      Api.Boards.post($scope.blocks).then(function(result){
        console.log(result.data);
      });
    }


    $scope.saveBlock = function(index){
      // alert('SAVE')

      var type = findType($scope.blocks[index].type,false);
      var data = $scope.blocks[index].var;

      $scope.blocks[index].isLoading=true;

      if(type=="type_content" || type=="type_link" || type=="type_image"){

        $scope.blocks[index].isEdit = false;
        $scope.blocks[index].isLoading=false;

      }else if(typeof data == "undefined" || data.length <= 0){

        ok=false;
        $scope.blocks[index].isLoading=false;

      }else{

        Api.Blocks.get(type,data,true).then(function(result){

          var ok=true;
          if(result.data.data.hasOwnProperty('content')){
            if(result.data.data.content.hasOwnProperty('statusCode')){
              if(result.data.data.content.statusCode!=200){
                ok=false;
              }
            }
          }
          
          $scope.blocks[index].isLoading=false;

          if(ok){
            $scope.blocks[index].content=result.data.data.content;
            $scope.blocks[index].isEdit = false;
          }

        });

      }

    }

    $scope.focusInput = function(){
      $(this).focus();
    }

    var types = [];
    $scope.getContentUrl = function(type) {
      var url = 'templates/blocks/'+findType(type,false)+'.html';
      return url;
    }

    $scope.blockMap = {
    	sizeX: 'block.size_x',
        sizeY: 'block.size_y',
        row: 'block.pos_y',
        col: 'block.pos_x'
    };

    $scope.blocks = [
      { size_x: 2, size_y: 1, pos_y: 0, pos_x: 0, type: "content", title: "Custom content", isEdit: false },
      { size_x: 1, size_y: 1, pos_y: 0, pos_x: 2, type: "twitter/userInfos", title: "Author's twitter", isEdit: false },
      { size_x: 1, size_y: 1, pos_y: 1, pos_x: 0, type: "image", title: "Image", isEdit: false },
      { size_x: 1, size_y: 1, pos_y: 1, pos_x: 1, type: "twitter/userTimeline", title: "Author's timeline", isEdit: false },
      { size_x: 1, size_y: 1, pos_y: 1, pos_x: 2, type: "news", title: "RSS feed", isEdit: false },
      { size_x: 1, size_y: 1, pos_y: 2, pos_x: 0, type: "link", title: "Custom link", isEdit: false },
      { size_x: 2, size_y: 1, pos_y: 2, pos_x: 1, type: "wiki", title: "Wikipedia article", isEdit: false }
    ];

    $scope.blocks=[];

    $scope.openLink = function(link){
      var win = window.open(link, '_blank');
      win.focus();
    }

     $scope.gridsterOpts = {
        columns: 3,
        margins: [0, 0],
        outerMargin: false,
        minColumns: 1,
        minRows: 2, 
        maxRows: 100,
        defaultSizeX: 1,
        defaultSizeY: 1,
        resizable: {
           enabled: true,
        },
        draggable: {
           enabled: true, // whether dragging items is supported
        }
    };

}]);