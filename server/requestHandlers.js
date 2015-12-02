var querystring = require("querystring");
var fs = require("fs");
var url = require('url');

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

function hello(conf, response, qs, postData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello");
    response.end();
}

function get_list(conf, response, qs, postData) {
    //console.log(url.parse(request.url));
    //console.log(JSON.stringify(request.querystring));
    // res = walk("."); response.json(res);
    conf.db.get_files(conf, response, qs.s_key);
}

function get_file(conf, response, qs, postData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("url:" + querystring.parse(postData).filename);
    response.end();
}

exports.hello = hello;
exports.get_list = get_list;
exports.get_file = get_file;
