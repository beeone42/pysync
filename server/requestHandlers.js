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

function hello(conf, response, qs, pd) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello");
    response.end();
}

function get_list(conf, response, qs, pd) {
    //console.log(url.parse(request.url));
    //console.log(JSON.stringify(request.querystring));
    // res = walk("."); response.json(res);
    conf.db.get_list(conf, response, qs.s_key);
}

function get_file(conf, response, qs, pd) {
    conf.db.get_file(conf, response, qs.s_key, qs.path);
}

function put_list(conf, response, qs, pd) {
    console.log(pd);
    conf.db.put_list(conf, response, pd.client_id, pd.s_key, JSON.parse(pd.data));
}

function register_client(conf, response, qs, pd) {
    console.log(qs);
    conf.db.register_client(conf, response, qs.m_key, qs.s_key, qs.baseurl);
}

exports.hello = hello;
exports.get_list = get_list;
exports.get_file = get_file;
exports.put_list = put_list;
exports.register_client = register_client;
