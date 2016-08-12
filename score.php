<?php

session_start();

header("Content-Type:application/json;charset=utf-8");
include "mysql_method.php";
include "redis_method.php";
include "utils.php";

if ($_SERVER["REQUEST_METHOD"] == "GET")
{
	if(!validateAuth())
	{
		echo '{"error":1}';
		return 0;
	}
	$id=$_COOKIE["id"];
	$hMysql=mysql_h_connect("accounter");
	return getScore($hMysql,$id);
}

function getScore($hMysql,$id)
{
	try
	{
		$res_obj=mysql_obj_getAccountById($hMysql,$id);
		echo '{"name":"'.$res_obj->name.'","score":"'.$res_obj->score.'","error":0}';
		return 1;
	}
	catch(Exception $e)
	{
		echo '{"error":1}';
		error_log($e->getMessage());
		exit;
	}
}

?>
