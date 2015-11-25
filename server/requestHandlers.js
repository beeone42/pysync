var querystring = require("querystring");

function hello(response, postData) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello");
    response.end();
}

function get_list(response, postData) {
    res = new Object();
    res.files = {};
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
