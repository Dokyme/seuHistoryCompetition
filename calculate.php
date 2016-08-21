<?php

session_start();

include "mysql_method.php";
include 'utils.php';

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    if(!validateAuth())
	{
		echo '{"error":1}';
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
    $countW=mysql_obj_Ncount($hMysql,$index)->$count;
    $count=mysql_obj_count($hMysql,$index)->$count;
    echo '{"count":"'.$count.'","countW":"'.$countW.'","average":"'.$average.'"}';
    return 1;
}

 ?>
