function get_list(conf, response, s_key) {
    var q = "SELECT `files`.id, `files`.path, `files`.size, `files`.mtime, `files`.md5 " +
	" FROM `files` " +
	" LEFT JOIN `keys` ON `keys`.id = `files`.key_id " +
	" LEFT JOIN `clients` on `clients`.id = `files`.client_id " +
	" WHERE `clients`.is_master = 1 " +
	"   AND `keys`.s_key = '" + conf.connection.escape(s_key) + "' " +
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
	" WHERE `keys`.s_key = '" + conf.connection.escape(s_key) + "' " +
	"   AND `files`.path = '" + conf.connection.escape(path) + "'";
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

function put_list(conf, response, client_id, s_key, files) {
    console.log(files);
    var q = "SELECT `keys`.id FROM `keys` WHERE s_key = " + conf.connection.escape(s_key);
    console.log(q);
    conf.connection.query(q, function(err, rows, fields) {
	if (!err)
	{
	    if (rows.length >= 0) // key already exist yet
	    {
		var key_id = rows[0].id;
		var q2 = "INSERT INTO `files` (key_id, client_id, path, size, mtime, md5) VALUES ";
		for (i = 0; i < files.length; i++)
		{
		    if (i > 0)
			q2 = q2 + ", ";
		    q2 = q2 + "(" +
			conf.connection.escape(key_id) + ", " +
			conf.connection.escape(client_id) + ", " +
			conf.connection.escape(files[i].path) + ", " +
			conf.connection.escape(files[i].size) + "," +
			conf.connection.escape(new Date(Date.parse(files[i].mtime)).toLocaleString()) + ", " +
			conf.connection.escape(files[i].md5) + ") ";
		}
		console.log(q2);
		conf.connection.query(q2, function(err, res, fields) {
		    if (!err)
		    {
			response.json({});
		    }
		    else
		    {
			console.log(err);
			response.fail(err);
		    }
		});
	    }
	    else
	    {
		response.fail("unknown s_key");
	    }
	}
	else
	{
	    response.error500();
	}
    });
}

function do_register_client(conf, response, key_id, baseurl, is_master)
{
    var q = "SELECT clients.id FROM clients " +
	" WHERE `clients`.baseurl = " + conf.connection.escape(baseurl) + " " +
	" AND `clients`.key_id = " + conf.connection.escape(key_id) + " ";
    console.log(q);
    conf.connection.query(q, function(err, rows, fields) {
	if (!err)
	{
	    console.log('The solution is: ', rows);
	    if (rows.length > 0)
		response.json({"client_id":rows[0].id});
	    else // new client
	    {
		var q2 = "INSERT INTO clients (key_id, baseurl, is_master) VALUES (" +
		    conf.connection.escape(key_id) + ", " +
		    conf.connection.escape(baseurl) + ", " +
		    conf.connection.escape(is_master) +
		    ")";
		console.log(q2);
		conf.connection.query(q2, function(err, res, fields) {
		    if (!err)
		    {
			response.json({"client_id":res.insertId});
		    }
		    else
		    {
			console.log('Error while performing Query.');
			console.log(err);
			response.error500();
		    }
		});
	    }
	}
	else
	{
	    console.log('Error while performing Query.');
	    console.log(err);
	    response.error500();
	}
    });
}

function register_client(conf, response, m_key, s_key, baseurl)
{

    var q = "SELECT `keys`.id FROM `keys` WHERE s_key = " + conf.connection.escape(s_key);
    console.log(q);
    conf.connection.query(q, function(err, rows, fields) {
	if (!err)
	{
	    if (rows.length == 0) // key doesn't exist yet
	    {
		if ((m_key != undefined) && (m_key != ""))
		{
		    var q2 = "INSERT INTO `keys` (m_key, s_key) VALUES (" + conf.connection.escape(m_key) +
			", " + conf.connection.escape(s_key) + ")";
		    console.log(q2);
		    conf.connection.query(q2, function(err, res, fields) {
			if (!err)
			{
			    console.log(res.insertId);
			    do_register_client(conf, response, res.insertId, baseurl, 1);
			}
			else
			{
			    console.log('Error while performing Query.');
			    console.log(err);
			    response.error500();
			}
		    });
		}
		else // m_key needed to register new key
		{
		    response.fail("m_key is missing");
		}
	    }
	    else
	    {
		console.log("key found");
		console.log(rows);
		do_register_client(conf, response, rows[0].id, baseurl, 0); // if not the first to register key, not the master
	    }
	}
	else
	{
	    console.log('Error while performing Query.');
	    console.log(err);
	    response.error500();
	}
    });
}


exports.get_list = get_list;
exports.get_file = get_file;
exports.put_list = put_list;
exports.register_client = register_client;

