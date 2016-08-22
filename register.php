<?php

session_start();


include "lib/mysql_method.php";
include "lib/utils.php";

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
	$req=$_POST["req"];
	$hMysql=mysql_h_connect("accounter");
	return register($hMysql,$req);
}

function register($hMysql,$req)
{
    try
    {
        $req_obj=json_decode($req);
        $oldAccount_obj=mysql_obj_getAccountById($hMysql,$req_obj->id);
        if(!$oldAccount_obj) //如果该ｉｄ不存在，则注册一个新的学生账号。
        {
            $res=mysql_obj_registerAccount($hMysql,$req_obj->id,$req_obj->cardNum,$req_obj->password,$req_obj->name);
            if(!$res)
            {
                echo '{"error":1,"msg":"未知的错误，请重试。"}';
                return 0;
            }
            $res->error=0;
            echo json_encode($res);
            return 1;
        }
        if($oldAccount_obj->cardNum==$req_obj->cardNum) //如果该ｉｄ存在，并且学号和一卡通号匹配，则修改密码。
        {
            $res=mysql_obj_setPassword($hMysql,$req_obj->id,$req_obj->password);
            if(!$res)
            {
                echo '{"error":1,"msg":"未知的错误，请重试。"}';
                return 0;
            }
            $res->error=0;
            echo json_encode($res);
            return 1;
        }
        else
        {
            echo '{"error":1,"msg":"学号和一卡通号不匹配，请重试。"}';
            return 0;
        }
    }
	catch (Exception $e)
    {
        echo '{"error":1,"msg":"未知的错误，请重试。"}';
        error_log($e->getMessage());
		exit;
    }

}

?>
