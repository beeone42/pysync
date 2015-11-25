var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var handle = {};

handle["/"] = requestHandlers.hello;
handle["/get_list"] = requestHandlers.get_list;
handle["/get_file"] = requestHandlers.get_file;

server.start(router.route, handle);
