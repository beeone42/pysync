<?php

function check_auth()
{
  global $config;

  if (!isset($_SESSION['login'])
     ||
     ($_SESSION['login'] != $config['auth_user']))
    return (false);

  if (!isset($_SESSION['passwd'])
     ||
     (hash('whirlpool', $_SESSION['passwd']) != $config['auth_pass']))
    return (false);

  return (true);
}

function chooser($view)
{
  global $config;

  if ($view == "")
    return ($config['default_view']);
  return ($view);
}

function display_view($view)
{
  global $config, $db;

  if (!array_key_exists($view, $config['views']))
    $view = $config['default_view'];
  if (file_exists("page/".$view.".raw.php"))
    include("page/".$view.".raw.php");
  else if (file_exists("page/".$view.".inc.php"))
    {
      include("page/head.inc.php");
      include("page/".$view.".inc.php");
      include("page/foot.inc.php");
    }
}

?>