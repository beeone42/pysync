var querystring = require("querystring");
var http = require("http");
var url = require("url");

function json(obj)
{
    var res = {};

    res['succes'] = true;
    res['data'] = obj;
    this.writeHead(200, {"Content-Type": "application/json"});
    this.write(JSON.stringify(res));
    this.end();
}

function fail(err)
{
    var res = {};

    res['succes'] = false;
    res['error'] = err;
    this.writeHead(200, {"Content-Type": "application/json"});
    this.write(JSON.stringify(res));
    this.end();
}

function text(str)
{
    this.writeHead(200, {"Content-Type": "plain/text"});
    this.write(str);
    this.end();
}

function error401()
{
    this.writeHead(401, {"Content-Type": "text/plain"});
    this.write("401 Unauthorized");
    this.end();
}

function error404()
{
    this.writeHead(404, {"Content-Type": "text/plain"});
    this.write("404 not Found");
    this.end();
}

function error500()
{
    this.writeHead(500, {"Content-Type": "text/plain"});
    this.write("500 Server Error");
    this.end();
}

function start(conf, route, handle) {
    function onRequest(request, response) {
	var postData = "";
	var pathname = url.parse(request.url).pathname;
	console.log("Request from " + request.connection.remoteAddress + " for path " + pathname + ".");
	response.remoteAddress = request.connection.remoteAddress;
	
	response.json = json;
	response.fail = fail;
	response.text = text;
	response.error401 = error401;
	response.error404 = error404;
	response.error500 = error500;
	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunk) {
	    postData += postDataChunk;
	    console.log("Paquet POST reçu '"+ postDataChunk + "'.");
	});
	request.addListener("end", function() {
	    //console.log(request);
	    var qs = querystring.parse(url.parse(request.url).query);
	    var pd = querystring.parse(postData);
	    console.log(JSON.stringify(qs));
	    console.log(JSON.stringify(pd));
	    route(conf, handle, pathname, response, qs, pd);
	});
    }
    http.createServer(onRequest).listen(conf.port);
    console.log("Running pysync server on port " + conf.port + ".");
}

exports.start = start;
