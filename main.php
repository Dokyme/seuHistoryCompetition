<?php

include 'genPap.php';
include 'redis_method.php';
include 'mysql_method.php';

$lName="multipleChoiceList";
$lNamee="multipleChoiceAnswerList";

$amount=200;
$n=40;
$piece=100;

$mysql_db=null;
$redis_db=null;
$paperArray=null;
$mc_answer=null;

$paperTmp=array();
$paperTmpt=array();

try{
    $mysql_db=mysql_h_connect('guest');
    $redis_db=redis_h_connect();
    $mc_answer=mysql_res_getAllMCAns($mysql_db);
    $paperArray=generatePaperArray($amount,$n,$piece);
}
catch(Exception $e)
{
    error_log($e->getMessage());
    exit;
}

redis_deleteList($redis_db,$lName);
redis_deleteList($redis_db,$lNamee);

for($i=0;$i<$n;$i++)
{
    for($j=0;$j<20;$j++)
    {    
        $paperTmp[$j]=mysql_obj_getMC($mysql_db,$paperArray[$i][$j]);
    }
    redis_insertListElement($redis_db,$lName,json_encode($paperTmp));
}

while($row=$mc_answer->fetch_object())
{
    redis_insertListElement($redis_db,$lNamee,$row->answer);
}

?>