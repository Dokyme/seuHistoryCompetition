<?php

//require_once('mysql_method.php');
require_once("../lib/mysql_method.php");

$hMysql=new MysqliDb (Array(
                    'host'=>'localhost',
                    'username'=>'accounter',
                    'password'=>'459861',
                    'db'=>'seuHCDB',
                ));
//$hmysql->where('id','71115325');
var_dump(mysql_obj_count($hMysql,'71'));
var_dump(mysql_obj_Ncount($hMysql,'71'));
var_dump(mysql_obj_calculateAverageScore($hMysql,'71'));
?>
