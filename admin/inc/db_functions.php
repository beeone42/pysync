<?php

$db = new DB_Functions();

class DB_Connect {
  private $mysqli;

  // constructor
  function __construct() {

  }

  // destructor
  function __destruct() {
    // $this->close();
  }

  // Connecting to database
  public function connect() {
    // connecting to mysql

    $this->mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    return $this->mysqli;
  }

  // Closing database connection
  public function close() {
    $this->mysqli->close();
  }

  // query
  public function query($q, $index = "")
  {
    if ($this->mysqli->real_query($q))
      {
        if ($result = $this->mysqli->use_result())
	  {
	    while ($row = $result->fetch_assoc())
	      {
		if ($index == "")
		  $res[] = $row;
		else
		  $res[$row[$index]] = $row;
		unset($row);
	      }
	    $result->close();
	    return ($res);
	  }
	return (TRUE);
      }
    return (FALSE);
  }

  public function real_escape_string($s)
  {
    return ($this->mysqli->real_escape_string($s));
  }

  public function insert_id()
  {
    return ($this->mysqli->insert_id);
  }

}

class DB_Functions {

  private $db;

  //put your code here
  // constructor
  function __construct() {

    // connecting to database
    $this->db = new DB_Connect();
    $this->db->connect();
  }

  // destructor
  function __destruct() {

  }

  //
  // your db functions goes here
  //

  /**
   * Getting all shares (keys)
   */
  public function getShares() {
    $result = $this->db->query("SELECT * FROM `keys`", "id");
    return $result;
  }

  /**
   * Getting all hosts (clients)
   */
  public function getHosts() {
    $result = $this->db->query("SELECT * FROM `clients`", "id");
    return $result;
  }

  /**
   * Getting files
   */
  public function getFiles($key = 0) {
    $q = "SELECT * FROM `files`";
    if ($key != 0)
      $q .= " WHERE (`key_id` = '{$key}')";
    $result = $this->db->query($q, "id");
    return $result;
  }

  public function insert_id()
  {
    return ($this->db->insert_id());
  }
}

?>