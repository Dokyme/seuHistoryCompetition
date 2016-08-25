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
$AnswerListName="paperAnswerList";

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
$multipleChoicePaperAnswer=array();
$judgementPaperAnswer=array();

try
{
    $mysql_db=mysql_h_connect('guest');
    $redis_db=redis_h_connect();
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
redis_deleteList($redis_db,$AnswerListName);

for($i=0;$i<$n;$i++)
{
    $obj=null;
    $answer=null;
    for($j=0;$j<20;$j++)
    {
        $multipleChoicePaperTemp[$j]=mysql_obj_getMultipleChoice($mysql_db,$multipleChoicePaperArray[$i][$j]);
        $multipleChoicePaperAnswer[$multipleChoicePaperArray[$i][$j]]=mysql_obj_getMultipleChoiceAnswer($mysql_db,$multipleChoicePaperArray[$i][$j])->answer;
    }
    for($j=0;$j<10;$j++)
    {
        $judgementPaperTemp[$j]=mysql_obj_getJudgement($mysql_db,$judgementPaperArray[$i][$j]);
        $judgementPaperAnswer[$multipleChoicePaperArray[$i][$j]]=mysql_obj_getJudgementAnswer($mysql_db,$judgementPaperArray[$i][$j])->answer;
    }
    $obj["multipleChoice"]=$multipleChoicePaperTemp;
    $obj["judgement"]=$judgementPaperTemp;
    $answer["multipleChoiceAnswer"]=$multipleChoicePaperAnswer;
    $answer["judgementAnswer"]=$judgementPaperAnswer;
    redis_insertListElement($redis_db,$listName,json_encode($obj));
    redis_insertListElement($redis_db,$AnswerListName,json_encode($answer));
}


//foreach ($multipleChoiceAnswers as $key => $value)
//{
//    redis_insertListElement($redis_db,$multipleChoiceAnswerListName,$value);
//}

//foreach ($judgementAnswers as $key => $value)
//{
//    redis_insertListElement($redis_db,$judgementAnswerListName,$value);
//}

?>
