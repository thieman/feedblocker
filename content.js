var monitorInterval = setInterval(monitorPath, 500);
var updateTimeout;
var blockInterval;
var lastPath;
var rawKeywords;
var keywords = [];

updateKeywords();

String.prototype.trim = function() {
	return String(this).replace(/^\s+|\s+$/g, '');
};

function updateKeywords() {
	chrome.extension.sendRequest(
		{method: 'getKeywords'},
		function(response) {
			rawKeywords = response;
			keywords = rawKeywords.split(',');
			for (var i = 0; i < keywords.length; i++) {
				keywords[i] = keywords[i].trim();
			}
			updateTimeout = setTimeout(updateKeywords, 2000);
		}
	);
}

function monitorPath() {
	if (window.location.pathname !== lastPath) {
		lastPath = window.location.pathname;
		if (window.location.pathname === '/') {
			blockInterval = setInterval(blockFeed, 500);
		} else {
			clearInterval(blockInterval);
		}
	}
}

function blockFeed() {
	// monitors the news feed for changes and blocks anything matching the block rawKeywords
	if (keywords.length === 0) {
		return;
	}

	$('#home_stream').children('li').each(function() {

		if ($(this).css('display') !== 'none') {
			var story = $(this);
			$(this).find(".userContent").each(function() {
				var content = $(this).text();
				for (var i = 0; i < keywords.length; i++) {
					if (keywords[i] === '') {
						continue;
					}
					var re = new RegExp(keywords[i], "i");
					if (content.match(re)) {
						$(story).hide();
					}
				}
			});
		}

	});
}
