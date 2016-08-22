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

function redis_bool_setHash($hRedis,$key,$hashKey,$value)
{
    $res=$hRedis->hSet($key,$hashKey,$value);
    return (bool)$res; //当该 hashKey　存在时，或者操作失败时，返回 false
}

function redis_str_getHash($hRedis,$key,$hashKey)
{
    $res=$hRedis->hGet($key,$hashKey);
    return $res;
}

function redis_bool_existHash($hRedis,$key,$hashKey)
{
    $res=$hRedis->hExists($key,$hashKey);
    return $res;
}

function redis_bool_deleteHash($hRedis,$key,$hashKey)
{
    $res=$hRedis->hDel($key,$hashKey);
    if($res==0)
    {
        return true;
    }
    return (bool)$res;
}

?>
