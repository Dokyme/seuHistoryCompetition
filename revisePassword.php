<?php

session_start();
include "mysql_method.php";
include "utils.php";

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
	if(!validateAuth())
	{
		echo '{"error":1}';
		return 0;
	}
	$hMysql=mysql_h_connect("accounter");
	$id=$_SESSION["id"];
	$req=$_POST["req"];
	return revisePassword($hMysql,$id,$req);
}

function revisePassword($hMysql,$id,$req)
{

    try {
        $req_obj=json_decode($req);
        $oldAccount_obj=mysql_obj_getAccountById($hMysql,$id);
        if(!$oldAccount_obj)
        {
            echo '{"error":1,"msg":"学号不存在，请重试。"}';
            return 0;
        }
        if($req_obj->oldPassword!=$oldAccount_obj->password)
        {
            echo '{"error":1,"msg":"旧密码不正确，请重试。"}';
            return 0;
        }
        $res=mysql_obj_setPassword($hMysql,$id,$req_obj->newPassword);
        if($res==-1)
        {
            echo '{"error":1,"msg":"未知的错误，请重试。"}';
			return 0;
        }
        $res->error=0;
        echo json_encode($res);
        return 1;
    } catch (Exception $e) {
        echo '{"error":1,"msg":"未知的错误，请重试。"}';
        error_log($e->getMessage());
        exit;
    }

}

 ?>
