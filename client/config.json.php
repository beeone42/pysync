<?php

/**
* This script is just an helper to generate your config.json
*/

$config = Array(
	"server_url" => "http://pysync.domain.com/tracker.py",
	"server_password" => "6b97eb534389f8721de8529992dc3fee",
	"folders" => Array(
		  "CDN" => Array(
		  	"path" => "/space/cdn/",
		  	"master_secret" => "",
		  	"slave_secret" => "qwerty9876543210"
			),
		  "pictures" => Array(
		  	     "path" => "/home/John/Pictures/",
		  	"master_secret" => "eb0a191797624dd3a48fa681d3061212",
		  	"slave_secret" => "03158cf39c6f316f9ce98a4e034cdc28"
			)
		)
	);

echo json_encode($config);

?>