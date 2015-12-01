var nconf = require('nconf');
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
nconf.argv().env();
nconf.file({ file: 'config.json' });
var conf = nconf.stores.file.store;
console.log(JSON.stringify(conf));


var VERSION = "v1";

handle["/"] = requestHandlers.hello;
handle["/api/" + VERSION + "/get_list"] = requestHandlers.get_list;
handle["/api/" + VERSION +"/get_file"] = requestHandlers.get_file;

server.start(conf, router.route, handle);
