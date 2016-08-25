<?php

session_start();

include 'lib/redis_method.php';
include 'lib/utils.php';
header("Content-Type:application/json;charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] == "GET")
{
	if(!validateAuth())
	{
		echo '{"error":1}';
		return 0;
	}
	$IP=getIP();
	$index=(ip2long($IP)%pow(10,2)%40+time()%1000)%40;
	$_SESSION["paperIndex"]=$index;
	return getPaper($index); //讲ｉｐ地址转换位ｌｏｎｇ，取最后两位并对试卷总数取模，加上时间戳（秒数）的最后三位对试卷总数取模，得到试卷ｉｄ。
}

function getPaper($index)
{
	$count=39;
	$lName="paperList";
	try
	{
		$redis_db=redis_h_connect();
		echo redis_json_getList($redis_db,$lName,$index); //从题库出题
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
