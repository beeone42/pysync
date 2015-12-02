function route(conf, handle, pathname, response, qs, postData) {
    console.log("Start processing URL " + pathname + ".");

    if (qs.auth != conf.server_password)
	response.error401();
    else
    if (typeof handle[pathname] === 'function') {
	try {
            return (handle[pathname](conf, response, qs, postData));
	} catch (ex) {
	    console.trace(ex)
	    response.error500();
	}
    } else {
        console.log("Missing handler for " + pathname);
	response.error404();
    }}

exports.route = route;
