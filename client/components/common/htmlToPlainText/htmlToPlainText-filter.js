app.filter('htmlToPlaintext', function() {
	return function(text) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = text;
		return tmp.textContent || tmp.innerText || "";
	}
});