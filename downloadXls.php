<?php

session_start();

include 'utils.php';
include 'mysql_method.php';
define('SOURCE_DIR', '/var/lib/mysql-files/');

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
	return download($hMysql,$index);
}

function download($hMysql,$index)
{
    mysql_file_exportXls($hMysql,$index);
    $tempDir="temp/".md5($index.time()).".xls";
    $absDir=dirname(__FILE__)."/".$tempDir;
    if(!copy(SOURCE_DIR.$index.".xls",$absDir))
    {
        echo SOURCE_DIR.$index.".xls"."|".$absDir;
        echo '{"error":1,"msg":"未知错误，请重试1"}';
        return 0;
    }
    if(!unlink(SOURCE_DIR.$index.".xls"))
    {
        echo '{"error":1,"msg":"未知错误，请重试2"}';
        return 0;
    }
    echo '{"error":0,"dir":"'.$tempDir.'"}';
    return 1;
}
 ?>
