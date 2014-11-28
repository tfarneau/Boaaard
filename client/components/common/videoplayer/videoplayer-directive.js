app.directive('videoplayer', function(){
    return {
        restrict : "EA",
        templateUrl : 'templates/template_player.html',
        link : function(scope,element,attrs){

            $(element).find('.close-overlay-help').bind('click',function(){
                player.video.pause();
                player.button.classList.remove('off');
                scope.showHelp=false;
                scope.$apply();
            });

            var player={};

            scope.mp4Src=attrs.mp4Src;
            scope.oggSrc=attrs.oggSrc;
            scope.webmSrc=attrs.webmSrc;
            scope.fallback=attrs.fallback;

            player.video=document.getElementById('video');
            player.button=document.getElementById('button');
            player.pB=document.getElementById('progressBar');

            player.button.classList.add('loading');

            player.playPause = function(e){
                if(e.type=='canplaythrough'){
                    player.video.removeEventListener('canplaythrough',player.playPause,false);
                }
                player.button.classList.remove('loading');
                if(player.video.paused){
                    player.video.play();
                    player.button.classList.add('off');
                }
                else{
                    player.video.pause();
                    player.button.classList.remove('off');
                }
            }

            player.playProgress = function (){
                var self=this;
                var progress=self.currentTime*100/self.duration;
                document.querySelector('.progress').style.width=progress+'%';
            }

            player.setVideoTime = function (e){
                e.stopPropagation();
                player.video.currentTime = e.offsetX*player.video.duration/this.offsetWidth;
            }

            player.video.addEventListener('canplaythrough',function(){
                player.button.classList.remove('loading');
            },false);
            $(element).find(".video_container").bind('click',player.playPause);

            player.video.addEventListener('timeupdate',player.playProgress,false);
            player.pB.addEventListener('click',player.setVideoTime,false);

            player.video.pause();
        }
    }
});