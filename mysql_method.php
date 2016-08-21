<?php

function mysql_h_connect($admin)
{
    $mysql=new mysqli('localhost',$admin,'459861','seuHCDB');
    if($mysql->connect_error)
    {
        return 0;
    }
    $mysql->set_charset('utf8');
    return $mysql;
}

function mysql_regexp($index)
{
    return "regexp "."'^0*".$index."[0-9A-B]15|16[0-9]{3}$'";
}

function mysql_get($hMysql,$strTable,$strField,$strWhere)
{
    $query="select ".$strField." from ".$strTable." where ".$strWhere." ;";
    //echo $query;
    $res=$hMysql->query($query);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_set($hMysql,$strTable,$strField,$strWhere,$value)
{
    $query="update ".$strTable." set ".$strField." = ".$value." where ".$strWhere." ;";
    $res=$hMysql->query($query);
    $res=mysql_obj_get($hMysql,$strTable,"*",$strWhere);
    if($res->$strField!=$value)
    {
        return -1;
    }
    return $res; //return the object after the update
}

function mysql_obj_setById($hMysql,$strTable,$strField,$id,$value)
{
    $res=mysql_obj_set($hMysql,$strTable,$strField,"id='".$id."'",$value);
    if($res==-1)
    {
        return -1;
    }
    return $res;
}

function mysql_obj_get($hMysql,$strTable,$strField,$strWhere)
{
    $res=mysql_get($hMysql,$strTable,$strField,$strWhere);
    if(!$res)
    {
        return 0;
    }
    return $res->fetch_object();
}

function mysql_getById($hMysql,$strTable,$strField,$id)
{
    $res=mysql_get($hMysql,$strTable,$strField,"id='".$id."'");
    if(!res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_getById($hMysql,$strTable,$strField,$id)
{
    $res=mysql_obj_get($hMysql,$strTable,$strField,"id=".$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_getMultipleChoice($hMysql,$id)
{
    $res=mysql_obj_getById($hMysql,"multipleChoice","id,question_description,choice_a,choice_b,choice_c,choice_d",$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_getJudgement($hMysql,$id)
{
    $res=mysql_obj_getById($hMysql,"judgement","id,question_description",$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_getMultipleChoiceAns($hMysql,$id)
{
    $res=mysql_obj_getById($hMysql,"multipleChoice","answer",$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_updateNewScore($hMysql,$id,$score)
{
    $res=mysql_obj_setById($hMysql,"account","score",$id,$score);
    if($res==-1)
    {
        return -1;
    }
    return $res;
}

function mysql_res_getAnswers($hMysql,$name)
{
    $res=mysql_get($hMysql,$name,"id,answer","1=1");
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_res_getMultipleChoiceAnswers($hMysql)
{
    $res=mysql_res_getAnswers($hMysql,"multipleChoice");
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_res_getJudgementAnswers($hMysql)
{
    $res=mysql_res_getAnswers($hMysql,"judgement");
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_getAccountById($hMysql,$id)
{
    $res=mysql_obj_getById($hMysql,"account","*",$id);
    if(!$res)
    {
        return 0;
    }
    return $res;
}

function mysql_obj_registerAccount($hMysql,$id,$cardNum,$password,$name)
{
    $query="insert into account set id='$id',cardNum=$cardNum,password='$password',name='$name',admin=0,score=-1";
    $hMysql->query($query);
    $res=mysql_obj_getAccountById($hMysql,$id);
    if(!$res)
    {
        return -1;
    }
    return $res;
}

function mysql_obj_setPassword($hMysql,$id,$newPassword)
{
    $res=mysql_obj_setById($hMysql,"account","password",$id,$newPassword);
    if($res==-1)
    {
        return -1;
    }
    return $res;
}

function mysql_file_exportXls($hMysql,$index) //$index 为系号
{
    $query="select * from account where id ".mysql_regexp($index)." into outfile '/var/lib/mysql-files/".$index.".xls';";
    $hMysql->query($query);
}

function mysql_obj_count($hMysql,$index)
{
    $res=mysql_obj_get($hMysql,"account","count(*)","id ".mysql_regexp($index));
    return $res;
}

function mysql_obj_Ncount($hMysql,$index)
{
    $res=mysql_obj_get($hMysql,"account","count(*)","id ".mysql_regexp($index)." and score!=-1 ");
    return $res;
}

function mysql_obj_calculateAverageScore($hMyql,$index)
{
    $res=mysql_obj_get($hMyql,"account","avg(score)","score!=-1 and id ".mysql_regexp($index));
    return $res;
}
?>
