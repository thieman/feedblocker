var saveTimeout;

$(document).ready(function() {

	$('#keywords').bind('input propertychange', function() {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(storeKeywords, 500);
	});

	loadKeywords();

});

function loadKeywords() {
	// get existing keywords from storage and plug into the form
	chrome.storage.sync.get('keywords', function(k) {
		$('#keywords').val(k['keywords']);
	});
}

function storeKeywords() {
	// push the entered keywords into storage
	chrome.storage.sync.set({
		'keywords': $('#keywords').val()
	});
}
