<?php

session_start();

include "lib/mysql_method.php";
include 'lib/utils.php';

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    if(!validateAuth())
	{
		echo '{"error":1,"msg":"权限错误。"}';
		return 0;
	}
	if($_SESSION["right"]!=1)
	{
		echo '{"error":1,"msg":"权限错误。"}';
		return 0;
	}
    $index=$_POST["index"];
    $hMysql=mysql_h_connect("root");
    return describe($hMysql,$index);
}

function describe($hMysql,$index)
{
    $avg="avg(score)";
    $count="count(*)";
    $average=mysql_obj_calculateAverageScore($hMysql,$index)->$avg;
    if(!$average)
    {
        echo '{"error":1,"msg":"未知错误，请重试"}';
		return 0;
    }
    $countW=mysql_obj_Ncount($hMysql,$index)->$count;
    if(!$countW)
    {
        echo '{"error":1,"msg":"未知错误，请重试"}';
		return 0;
    }
    $count=mysql_obj_count($hMysql,$index)->$count;
    if(!$count)
    {
        echo '{"error":1,"msg":"未知错误，请重试"}';
		return 0;
    }
    echo '{"count":"'.$count.'","countW":"'.$countW.'","average":"'.$average.'"}';
    return 1;
}

 ?>
