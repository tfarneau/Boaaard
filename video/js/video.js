'use strict';

var player={};

player.video=document.getElementById('video');
player.button=document.getElementById('button');
player.pB=document.getElementById('progressBar');

player.video.load();
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
	player.video.currentTime=e.offsetX*player.video.duration/this.offsetWidth;
}


player.video.addEventListener('canplaythrough',player.playPause,false);
window.addEventListener('click',player.playPause,false);
player.video.addEventListener('timeupdate',player.playProgress,false);
player.pB.addEventListener('click',player.setVideoTime,false);

console.log(player); 















