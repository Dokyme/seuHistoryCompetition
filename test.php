<?php
include "redis_method.php";
$hashName="md5-cookies";
$Time=time();
$id=$_POST["id"];
$pw=$_POST["pw"];
$str=md5($id.$pw.$Time);
setCookie("auth",$str);
echo "true";
$hRedis=redis_h_connect();
$str="40bd99304f76324443b63bc216516482";
if(redis_bool_existHash($hRedis,$hashName,$str))
{
    echo "exists the md5-cookie".redis_str_getHash($hRedis,$hashName,$str);
}

 ?>
