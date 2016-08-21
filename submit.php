<?php

session_start();

header("Content-Type:application/json;charset=utf-8");
include "mysql_method.php";
include "redis_method.php";
include "utils.php";

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
	if(!validateAuth())
	{
		echo '{"error":1}';
		return 0;
	}
	$req=$_POST["req"];
	$id=$_SESSION["id"];
	$hRedis=redis_h_connect();
	$hMysql=mysql_h_connect("accounter");
	return submit($hMysql,$hRedis,$id,$req);
}

function submit($hMysql,$hRedis,$id,$req)
{
	try
	{
		$score=0;
		$req_obj=json_decode($req);
		$multipleChoiceAns=$req_obj->multipleChoiceAnswer;
		foreach ($multipleChoiceAns as $itAnswer)
		{
			if(redis_str_getAnswer($hRedis,"multipleChoiceAnswerList",$itAnswer->id)==chr($itAnswer->choice+97))
			{
				$score+=5;
			}
		}
		$judgementAns=$req_obj->judgementAnswer;
		foreach ($judgementAns as $itAnswer)
		{
			if(redis_str_getAnswer($hRedis,"judgementAnswerList",$itAnswer->id)==$itAnswer->choice)
			{
				$score+=5;
			}
		}
		$res_obj=mysql_obj_updateNewScore($hMysql,$id,$score);
		if($res_obj==-1)
		{
			echo '{"error":1}';
			return 0;
		}
		echo '{"score":"'.$res_obj->score.'","error":0}';
		return 1;
	}
	catch(Exception $e)
	{
		echo '{"error":1}';
		error_log($e->getMessage());
		exit;
	}

}

?>
