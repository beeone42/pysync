var mysql = require('mysql');
var nconf = require('nconf');
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var db = require("./db");

var handle = {};
nconf.argv().env();
nconf.file({ file: 'config.json' });
var conf = nconf.stores.file.store;
console.log(JSON.stringify(conf));

conf.db = db;
conf.connection = mysql.createConnection({
    host     : conf.mysql_host,
    user     : conf.mysql_user,
    password : conf.mysql_pass,
    database : conf.mysql_db
});

conf.connection.connect(function(err){
    if(!err) {
	console.log("Database is connected ... nn");
    } else {
	console.log("Error connecting database ... nn");
    }
});

var VERSION = "v1";

handle["/"] = requestHandlers.hello;
handle["/api/" + VERSION + "/get_list"] = requestHandlers.get_list;
handle["/api/" + VERSION +"/get_file"] = requestHandlers.get_file;
handle["/api/" + VERSION +"/put_list"] = requestHandlers.put_list;
handle["/api/" + VERSION +"/reset_list"] = requestHandlers.reset_list;
handle["/api/" + VERSION +"/register_client"] = requestHandlers.register_client;

server.start(conf, router.route, handle);
