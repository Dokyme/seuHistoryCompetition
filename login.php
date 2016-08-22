<?php

session_start();

header("Content-Type:application/json;charset=utf-8");
include 'lib/mysql_method.php';
include 'lib/redis_method.php';

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
	deleteSession("auth");
	deleteSession("id");
	deleteSession("right");
	deleteCookies("auth");
	deleteCookies("id");
	deleteCookies("right");
	$id = $_POST["id"];
	$password = $_POST["pw"];
	$hMysql=mysql_h_connect('accounter');
	return login($hMysql,$id,$password);
}

function deleteCookies($cook)
{
	if(isset($_COOKIE["$cook"]))
	{
		setCookie("$cook","",time()-3600);
	}
}

function deleteSession($sess)
{
	if(isset($_SESSION["$sess"]))
	{
		unset($_SESSION["$sess"]);
	}
}

function login($hMysql,$id,$pw)
{
	try
	{
		$objAccount=mysql_obj_getAccountById($hMysql,$id);
		if(!$objAccount) //如果该ｉｄ不存在
		{
			echo '{"right":"-1"}';
			return 0;
		}
		if($objAccount->password!=$pw) //
		{
			echo '{"right":"-1"}';
			return 0;
		}
		$rawStr=$id+$pw+time();
		$md5Str=md5($rawStr);
		$_SESSION["auth"]=$md5Str;
		$_SESSION["right"]=$objAccount->admin;
		$_SESSION["id"]=$id;
		setCookie("auth",$md5Str,time()+2700); //ｃｏｏｋｉｅｓ中包含一个代表登陆状态的ａｕｔｈ字符串
		setCookie("id",$id,time()+2700);
		setCookie("right",$objAccount->admin,time()+2700);
		echo '{"name":"'.$objAccount->name.'","ID":"'.$objAccount->id.'","right":"'.$objAccount->admin.'","score":"'.$objAccount->score.'"}';
		return 1;
	}
	catch(Exception $e)
	{
		echo '{"right":"-1","msg":"未知的错误。"}';
		error_log($e->getMessage());
    	exit;
	}
}
?>
