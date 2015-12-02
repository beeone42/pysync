function get_list(conf, response, s_key) {
    var q = "SELECT `files`.id, `files`.path, `files`.size, `files`.mtime, `files`.md5 " +
	" FROM `files` " +
	" LEFT JOIN `keys` ON `keys`.id = `files`.key_id " +
	" LEFT JOIN `clients` on `clients`.id = `files`.client_id " +
	" WHERE `clients`.is_master = 1 "
	"   AND `keys`.s_key = '" + s_key + "' " +
	" GROUP BY path ORDER BY mtime DESC";
    console.log(q);
    conf.connection.query(q, function(err, rows, fields) {
	if (!err)
	{
	    console.log('The solution is: ', rows);
	    response.json(rows);
	}
	else
	{
	    console.log('Error while performing Query.');
	    response.error500();
	}
    });
}

function get_file(conf, response, s_key, path) {
    var q = "SELECT `files`.id, `files`.path, `files`.size, `files`.mtime, `files`.md5, `clients`.baseurl " +
	" FROM `files` " +
	" LEFT JOIN `keys` ON `keys`.id = `files`.key_id " +
	" LEFT JOIN `clients` on `clients`.id = `files`.client_id " +
	" WHERE `keys`.s_key = '" + s_key + "' " +
	"   AND `files`.path = '" + path + "'";
    console.log(q);
    conf.connection.query(q, function(err, rows, fields) {
	if (!err)
	{
	    console.log('The solution is: ', rows);
	    response.json(rows);
	}
	else
	{
	    console.log('Error while performing Query.');
	    response.error500();
	}
    });

}

exports.get_list = get_list;
exports.get_file = get_file;
