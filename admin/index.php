<?php

error_reporting(E_ALL & ~E_NOTICE);

session_cache_limiter('nocache');
session_start();

include('inc/config.php');
include('inc/functions.php');

if (1)//check_auth())
  {
    $view = chooser($_REQUEST['view']);
  }
else
  {
    $view = 'login';
  }

display_view($view);

?>