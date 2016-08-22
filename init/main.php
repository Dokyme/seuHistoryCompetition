<?php

include 'genPap.php';
include '../lib/redis_method.php';
include '../lib/mysql_method.php';

$multipleChoiceListName="multipleChoiceList";
$multipleChoiceAnswerListName="multipleChoiceAnswerList";
$multipleChoiceAmount=200;
$judgementListName="judgementList";
$judgementAnswerListName="judgementAnswerList";
$judgementAmount=100;

$listName="paperList";

$n=40;
$piece=100;

$mysql_db=null;
$redis_db=null;
$multipleChoicePaperArray=null;
$judgementPaperArray=null;
$multipleChoiceAnswers=null;
$judgementAnswers=null;

$multipleChoicePaperTemp=array();
$judgementPaperTemp=array();

try
{
    $mysql_db=mysql_h_connect('guest');
    $redis_db=redis_h_connect();
    $multipleChoiceAnswers=mysql_arr_getMultipleChoiceAnswers($mysql_db); //Array
    $judgementAnswers=mysql_arr_getJudgementAnswers($mysql_db); //Array
    $multipleChoicePaperArray=generatePaperArray($multipleChoiceAmount,$n,$piece,20); //nx20 Array
    $judgementPaperArray=generatePaperArray($judgementAmount,$n,$piece,10); //nx10 Array
}
catch(Exception $e)
{
    error_log($e->getMessage());
    exit;
}

redis_deleteList($redis_db,$multipleChoiceListName);
redis_deleteList($redis_db,$judgementListName);
redis_deleteList($redis_db,$multipleChoiceAnswerListName);
redis_deleteList($redis_db,$judgementAnswerListName);
redis_deleteList($redis_db,$listName);

for($i=0;$i<$n;$i++)
{
    $obj=null;
    for($j=0;$j<20;$j++)
    {
        $multipleChoicePaperTemp[$j]=mysql_obj_getMultipleChoice($mysql_db,$multipleChoicePaperArray[$i][$j]);
    }
    for($j=0;$j<10;$j++)
    {
        $judgementPaperTemp[$j]=mysql_obj_getJudgement($mysql_db,$judgementPaperArray[$i][$j]);
    }
    $obj["multipleChoice"]=$multipleChoicePaperTemp;
    $obj["judgement"]=$judgementPaperTemp;
    redis_insertListElement($redis_db,$listName,json_encode($obj));
}


foreach ($multipleChoiceAnswers as $key => $value)
{
    redis_insertListElement($redis_db,$multipleChoiceAnswerListName,$value);
}

foreach ($judgementAnswers as $key => $value)
{
    redis_insertListElement($redis_db,$judgementAnswerListName,$value);
}

?>
