<?php

session_start();

header("Content-Type:application/json;charset=utf-8");
include "lib/mysql_method.php";
include "lib/redis_method.php";
include "lib/utils.php";

if ($_SERVER["REQUEST_METHOD"] == "GET")
{
	if(!validateAuth())
	{
		echo '{"error":1,"msg":"权限错误。"}';
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
		if(!$res_obj)
		{
			echo '{"error":1,"msg":"未知的错误。"}';
			return 0;
		}
		echo '{"name":"'.$res_obj->name.'","score":"'.$res_obj->score.'","error":0}';
		return 1;
	}
	catch(Exception $e)
	{
		echo '{"error":1,"msg":"未知的错误。"}';
		error_log($e->getMessage());
		exit;
	}
}

?>
