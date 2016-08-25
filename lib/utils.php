<?php

function validateAuth()
{
    if (isset($_COOKIE["auth"]) && isset($_COOKIE["id"]) && isset($_COOKIE["right"]))
    {
        if($_SESSION["auth"]==$_COOKIE["auth"] && $_SESSION["id"]==$_COOKIE["id"] && $_SESSION["right"]==$_COOKIE["right"])
        {
            return true;
        }
    }
    return false;
}

function downloadFile($filePath)
{
    ob_end_clean();
    $hFile=fopen($filePath,"r");
    if(!$hFile)
    {
        echo '{"error":1}';
        return;
    }
    $fileName;
    header("Content-Type:application/vnd.ms-excel");
    header("Accept-Ranges:bytes");
    header("Content-Length:".filesize($filePath));
    header("Content-Disposition:attachment;filename='".$fileName.".xls'");
    while (!feof($hFile))
    {
        echo fread($hFile,8096);
    }
    fclose($hFile);
}

function getIP()
{
    $ip=0;
    if(isset($_SERVER))
    {
        if(isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
        {
            $ip=$_SERVER["HTTP_X_FORWARDED_FOR"];
        }
        else if(isset($_SERVER["HTTP_CLIENT_IP"]))
        {
            $ip=$_SERVER["HTTP_CLIENT_IP"];
        }
        else
        {
            $ip=$_SERVER["REMOTE_ADDR"];
        }
    }
    else
    {
        if(getenv("HTTP_X_FORWARDED_FOR"))
        {
            $ip=getenv("HTTP_X_FORWARDED_FOR");
        }
        else if(getenv("HTTP_CLIENT_IP"))
        {
            $ip=getenv("HTTP_CLIENT_IP");
        }
        else
        {
            $ip=getenv("REMOTE_ADDR");
        }
    }
    return $ip;
}

function object_array($array)
{
    if(is_object($array)) {
        $array = (array)$array;
     } if(is_array($array)) {
         foreach($array as $key=>$value) {
             $array[$key] = object_array($value);
             }
     }
     return $array;
}

 ?>
