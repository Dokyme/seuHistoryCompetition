<?php

session_start();

header("Content-Type:application/json;charset=utf-8");
include "lib/mysql_method.php";
include "lib/redis_method.php";
include "lib/utils.php";

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
	if(!validateAuth())
	{
		echo '{"error":1,"msg":"权限错误"}';
		return 0;
	}
	$req=$_POST["req"];
	$id=$_SESSION["id"];
	$hRedis=redis_h_connect();
	$hMysql=mysql_h_connect("accounter");
	$paperIndex=$_SESSION["paperIndex"];
	return submit($hMysql,$hRedis,$id,$req,$paperIndex);
}

function submit($hMysql,$hRedis,$id,$req,$paperIndex)
{
	try
	{
		$score=0;
		$req_obj=json_decode($req);
		$multipleChoiceAns=$req_obj->multipleChoiceAnswer;
		$ansListArr=object_array(json_decode(redis_json_getAnswerList($hRedis,$paperIndex)));
		foreach ($multipleChoiceAns as $itAnswer)
		{
			$pid=($itAnswer->id);
			if($ansListArr["multipleChoiceAnswer"][$pid]==chr($itAnswer->choice+97))
			{
				$score+=5;
			}
		}
		$judgementAns=$req_obj->judgementAnswer;
		foreach ($judgementAns as $itAnswer)
		{
			$pid=($itAnswer->id);
			if($ansListArr["judgementAnswer"][$pid]==chr($itAnswer->choice+97))
			{
				$score+=5;
			}
		}
		$res_obj=mysql_obj_updateNewScore($hMysql,$id,$score);
		if(!$res_obj)
		{
			echo '{"error":1,"msg":"未知的错误。"}';
			return 0;
		}
		echo '{"score":"'.$res_obj->score.'","error":0}';
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
