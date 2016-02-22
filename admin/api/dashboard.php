<?php

require("../inc/config.php");
require("../inc/db_functions.php");

$vals = Array(
      	"nb_shares" => count($db->getShares()),
	"nb_hosts"  => count($db->getHosts()),
	"nb_files"  => count($db->getFiles())
      );

header("Content-Type: application/json");
echo json_encode($vals);

?>