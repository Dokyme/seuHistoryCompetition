<?php

function redis_h_connect()
{
    $redis=new Redis();
    $redis->connect('127.0.0.1',6379);
    if(!$redis)
    {
        //echo "failed";
        return 0;
    }
    return $redis;
}

function redis_insertListElement($hRedis,$lName,$strE)
{
    $hRedis->rPush($lName,$strE);
    return true;
}

function redis_json_getList($hRedis,$lName,$id)
{
    $res=$hRedis->lIndex($lName,$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function redis_str_getAnswer($hRedis,$lName,$id)
{
    $res=$hRedis->lIndex($lName,$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function redis_json_getAnswerList($hRedis,$id)
{
    $res=redis_json_getList($hRedis,"paperAnswerList",$id);
    return $res;
}

function redis_json_getListAns($hRedis,$id)
{
    $res=redis_json_getList($hRedis,"multipleChoiceAnswerList",$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function redis_deleteList($hRedis,$lName)
{
    $count=$hRedis->lLen($lName);
    for ($i=0; $i < $count; $i++)
    {
        $hRedis->blPop($lName,0);
    }
    return true;
}

?>
