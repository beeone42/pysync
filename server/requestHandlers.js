var querystring = require("querystring");
var fs = require("fs");
var url = require('url');

// walk local file system just for debug purpose
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
    if (qs.s_key == undefined)
	response.fail("s_key field is missing in GET");
    else
	conf.db.get_list(conf, response, qs.s_key);
}

function get_file(conf, response, qs, pd) {
    if (qs.s_key == undefined)
	response.fail("s_key field is missing in GET");
    else
    if (qs.path == undefined)
	response.fail("path field is missing in GET");
    else
	conf.db.get_file(conf, response, qs.s_key, qs.path);
}

function put_list(conf, response, qs, pd) {
    console.log(pd);
    if (pd.client_id == undefined)
	response.fail("client_id field is missing in POST");
    else
    if (pd.s_key == undefined)
	response.fail("s_key field is missing in POST");
    else
    if (pd.data == undefined)
	response.fail("data field is missing in POST");
    else
	conf.db.put_list(conf, response, pd.client_id, pd.s_key, JSON.parse(pd.data));
}

function reset_list(conf, response, qs, pd) {
    if (qs.client_id == undefined)
	response.fail("client_id field is missing in GET");
    else
    if (qs.s_key == undefined)
	response.fail("s_key field is missing in GET");
    else
	conf.db.reset_list(conf, response, qs.client_id, qs.s_key);
}

function register_client(conf, response, qs, pd) {
    if (qs.s_key == undefined)
	response.fail("s_key field is missing in GET");
    else
    if (qs.baseurl == undefined)
	response.fail("baseurl field is missing in GET");
    else
    {
	console.log("REMOTE_IP: " + response.remoteAddress);
	conf.db.register_client(conf, response, qs.m_key, qs.s_key,
				qs.baseurl.replace('[IP]', response.remoteAddress.replace('::ffff:', '')));
    }
}

exports.hello = hello;
exports.get_list = get_list;
exports.get_file = get_file;
exports.put_list = put_list;
exports.reset_list = reset_list;
exports.register_client = register_client;
