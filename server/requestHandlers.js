var querystring = require("querystring");
var fs = require("fs");

function walk(path)
{
    console.log("walk " + path);
    var res = [];
    var tmp = fs.readdirSync(path);
    tmp.forEach(function (file) {
	console.log("file: [" + file + "]");
	stats = fs.statSync(path + "/" + file);
	console.log(stats);
	var f = {};
	f['name'] = path + "/" + file;
	f['size'] = stats['size'];
	f['mtime'] = stats['mtime'];
	res.push(f);
	if (stats.isDirectory())
	{
	    res = res.concat(walk(path + "/" + file));
	}
    });
    return (res);
}

function hello(response, postData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello");
    response.end();
}

function get_list(response, postData) {
    res = walk(".");
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(res));
    response.end();

}

function get_file(response, postData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("url:" + querystring.parse(postData).filename);
    response.end();
}

exports.hello = hello;
exports.get_list = get_list;
exports.get_file = get_file;
