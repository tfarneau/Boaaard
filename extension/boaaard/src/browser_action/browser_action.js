function extractIdFromUrl(url){

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
	var match = url.match(regExp);

	if (match && match.length >= 2){

		var url = "http://localhost/hetic/boaaard_client/#/create/"+match[2];
		window.open(url, '_blank');
  		win.focus();

	}else{

		document.getElementById('error').innerHTML = "Ceci n'est pas un lien youtube !";

	}

}

function checkVideo(e) {

	chrome.tabs.getSelected(null, function(tab) {
	    extractIdFromUrl(tab.url) ;
	});

}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('click-me').addEventListener('click', checkVideo);
})