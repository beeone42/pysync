var http = require("http");
var url = require("url");

function start(conf, route, handle) {
    function onRequest(request, response) {
	var postData = "";
	var pathname = url.parse(request.url).pathname;
	console.log("Request for path " + pathname + ".");
	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunk) {
	    postData += postDataChunk;
	    console.log("Paquet POST reçu '"+ postDataChunk + "'.");
	});
	request.addListener("end", function() {
	    route(handle, pathname, response, postData);
	});
    }
    http.createServer(onRequest).listen(conf.port);
    console.log("Running pysync server on port " + conf.port + ".");
}

exports.start = start;
