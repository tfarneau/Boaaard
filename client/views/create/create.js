angular
	.module('boViewCreate', [])
	.controller('CreateCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', 'Api', 'Find', function($scope, $rootScope, $routeParams, $timeout, Api, Find) {

        // Display full header
        $rootScope.fullHeader = true;

        // Board creation
        $scope.manageBoard = false;

        // Set the page title
        $rootScope.title = "Boaaard - Create";

        // Board object
        $scope.board = {
            infos : {
                url : '',
                name : '',
                description : '',
                owner_email : ''
            },
            blocks : {}
        };

        $scope.board.blocks = [];

        // Init some variables
        $scope.startValidate = false;
        $scope.validate = null;
        $scope.saved = false;
        $scope.editMode=true;
        $scope.addBlockOpened = false;

        // Help video
        $scope.showHelp = false;
        $scope.openHelpVideo = function(){
            $scope.showHelp = true;
        }

        // If url params
        if($routeParams.url){
            // Get url in params
            $scope.board.infos.url = 'https://www.youtube.com/watch?v=' + $routeParams.url;
        }
        
        /**
         * Youtube link validation
         */
        $scope.validateYoutube = function() {

            $scope.startValidate = true;
    
            // Get validation from API                
            Api.Video.validate($scope.board.infos.url).then(function(result){

                $scope.startValidate = false;

                // If video OK
                if(result.data.status == true){
                    $scope.validate = true;

                    // Get video thumbnail
                    $scope.thumbnail = result.data.data.items[0].snippet.thumbnails.medium.url;

                    // Sanetize url
                    $scope.board.infos.url = "https://www.youtube.com/watch?v=" + result.data.data.items[0].id;
                    
                    // Next step animation
                    $timeout(function(){
                        $scope.isSubmit = true;
                    }, 1000);
                }
                // Invalid video
                else{

                    // reset animation validation
                    $scope.validate = false;
                    $timeout(function(){
                        $scope.validate = null;
                    }, 1000);
                }
            });
        }

        /**
         * Start board management
         */
        $scope.create = function() {
            $scope.manageBoard = true;
        }

        /**
         * Save board
         */
        $scope.save = function() {

            // Store board in API
            Api.Board.post($scope.board).then(function(result){
                // If ok
                if(result.data.status == true){
                    $scope.saved = true;
                    $scope.slug = result.data.data.infos.slug;
                }
            });
        }

        /**
         * GOAT Easter Egg
         * @param  {int} index Block
         */
        $scope.onChevre = function(index){
            if($scope.board.blocks[index].var=="chevre"){
                $scope.board.blocks[index].var = "http://idata.over-blog.com/3/56/02/16/2010-08/Chevre-yeux.jpg";
                $scope.board.blocks[index].isEdit = false;
            }
        }

        /**
         * Add block to board
         * @param {string} type Type of block
         */
        $scope.addBlock = function(type){

            // If type exist
            type = Find.type(type,true);

            // Close overlay
            $scope.addBlockOpened=false;

            // Push new block
            $scope.board.blocks.push({ type: type, title: "Block title", isEdit: true });
        };

        /**
         * Delete block
         * @param  {int} index Block
         */
        $scope.deleteBlock = function(index){

            // Delete block
            $scope.board.blocks.splice(index, 1);
        }

        /**
         * Save block
         * @param  {int} index Block
         */
        $scope.saveBlock = function(index){

            // If type exist
            var type = Find.type($scope.board.blocks[index].type,false);
            var data = $scope.board.blocks[index].var;

            // If block validation
            if(data){
                // Sanitize
                data = data.replace(/#/g, '%23');
            }

            // Loading content
            $scope.board.blocks[index].isLoading=true;

            // Direct access block
            if(type=="type_content" || type=="type_link" || type=="type_image") {

                // Return block and stop loading
                $scope.board.blocks[index].isEdit = false;
                $scope.board.blocks[index].isLoading=false;

            }
            // Data error
            else if(typeof data == "undefined" || data.length <= 0) {

                ok=false;

                // Stop loading but not return the block
                $scope.board.blocks[index].isLoading=false;

            }
            else {

                // Get block content
                Api.Block.get(type,data,true).then(function(result){

                    var ok = true;

                    if(result.data.data.hasOwnProperty('content')){
                        if(result.data.data.content.hasOwnProperty('statusCode')){
                            if(result.data.data.content.statusCode!=200){
                                ok=false;
                            }
                        }
                    }

                    // Return block and stop content
                    $scope.board.blocks[index].isLoading=false;

                    if(ok){
                        $scope.board.blocks[index].content=result.data.data.content;
                        $scope.board.blocks[index].isEdit = false;
                    }

                });

            }

        }

        /**
         * Focus on input
         */
        $scope.focusInput = function(){
            $(this).focus();
        }

        /**
         * Get block content
         * @param  {string} type Block
         */
        $scope.getContentUrl = function(type) {
            var url = 'templates/blocks/'+Find.type(type,false)+'.html';
            return url;
        }

        // Blocks position
        $scope.blockMap = {
            sizeX: 'block.size_x',
            sizeY: 'block.size_y',
            row: 'block.pos_y',
            col: 'block.pos_x'
        };

        /**
         * Open add block overlay
         */
        $scope.openList = function(){
            $scope.addBlockOpened = true;
        }

        /**
         * Open link in block
         * @param  {string} link URL
         */
        $scope.openLink = function(link){
            var win = window.open(link, '_blank');
            win.focus();
        }

        // Gridster configuration
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
               enabled: true
            },
            draggable: {
               enabled: true
            }
        };

	}]);