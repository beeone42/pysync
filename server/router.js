function route(handle, pathname, response, postData) {
    console.log("Start processing URL " + pathname + ".");
    if (typeof handle[pathname] === 'function') {
	try {
            return (handle[pathname](response, postData));
	} catch (ex) {
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("500 Server Error\r\n" + ex);
	    console.trace(ex)
	    response.end();
	}
    } else {
        console.log("Missing handler for " + pathname);
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 not Found");
	response.end();
    }}

exports.route = route;
