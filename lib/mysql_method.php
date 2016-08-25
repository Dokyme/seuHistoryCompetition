<?php

require_once("MysqliDb.php");

function mysql_h_connect($admin) //return handle of mysql based on MysqliDb
{
    $db=new MysqliDb (Array(
                        'host'=>'localhost',
                        'username'=>$admin,
                        'password'=>'459861',
                        'db'=>'seuHCDB',
                        'charset'=>'utf8'
                        ));
    return $db;
}

function mysql_regexp($index)
{
    return "regexp "."'^0*".$index."[0-9A-B]15|16[0-9]{3}$'";
}

function mysql_obj_getById($hMysql,$strTable,$arrField,$id) //Limit 1
{
    $hMysql->where('id',$id);
    $res=$hMysql->getOne($strTable,$arrField);
    if(!$res)
    {
        return false;
    }
    return (object)$res;
}

function mysql_obj_getAccountById($hMysql,$id) //Limit 1
{
    $res=mysql_obj_getById($hMysql,"account","*",$id);
    return $res;
}

function mysql_obj_getMultipleChoice($hMysql,$id) //Limit 1
{
    $arrField=Array('id','question_description','choice_a','choice_b','choice_c','choice_d');
    $res=mysql_obj_getById($hMysql,"multipleChoice",$arrField,$id);
    return $res;
}

function mysql_obj_getJudgement($hMysql,$id) //Limit 1
{
    $arrField=Array('id','question_description');
    $res=mysql_obj_getById($hMysql,"judgement",$arrField,$id);
    return $res;
}

function mysql_obj_updateNewScore($hMysql,$id,$score) //Limit 1
{
    $arrScore=Array('score'=>$score);
    $hMysql->where('id',$id);
    $res=$hMysql->update('account',$arrScore);
    if(!$res)
    {
        return false;
    }
    return mysql_obj_getAccountById($hMysql,$id);
}

function mysql_obj_registerAccount($hMysql,$id,$cardNum,$password,$name) //Limit 1
{
    $data=Array('id'=>$id,
                'cardNum'=>$cardNum,
                'password'=>$password,
                'name'=>$name,
                'admin'=>0,
                'score'=>-1
                );
    if(!$hMysql->insert("account",$data))
    {
        return false;
    }
    return mysql_obj_getAccountById($hMysql,$id);
}

function mysql_obj_setPassword($hMysql,$id,$newPassword) //Limit 1
{
    $arrData=Array('password'=>$newPassword);
    $hMysql->where('id',$id);
    $res=$hMysql->update('account',$arrData);
    if(!$res)
    {
        return false;
    }
    return mysql_obj_getAccountById($hMysql,$id);
}

function mysql_obj_getAnswer($hMysql,$name,$id) //Limit 1
{
    $field=Array('id','answer');
    $res=mysql_obj_getById($hMysql,$name,$field,$id);
    return $res;
}

function mysql_obj_getMultipleChoiceAnswer($hMysql,$id) //Limit 1
{
    $res=mysql_obj_getAnswer($hMysql,"multipleChoice",$id);
    return $res;
}

function mysql_obj_getJudgementAnswer($hMysql,$id) //Limit 1
{
    $res=mysql_obj_getAnswer($hMysql,"judgement",$id);
    return $res;
}

function mysql_file_exportXls($hMysql,$index) //$index 为系号
{
    $res=$hMysql->rawQuery("select * from account where id ".mysql_regexp($index)." into outfile '/var/lib/mysql-files/".$index.".xls';");
    //$query="select * from account where id ".mysql_regexp($index)." into outfile '/var/lib/mysql-files/".$index.".xls';";
    //$hMysql->query($query);
    exec("iconv -f utf8 -t gbk -o /var/lib/mysql-files/tp".$index.".xls /var/lib/mysql-files/".$index.".xls");
    return (object)$res;
}

function mysql_obj_count($hMysql,$index)
{
    $res=$hMysql->rawQuery("select count(*) from account where id ".mysql_regexp($index).";");
    if(!$res)
    {
        return false;
    }
    return (object)$res[0];
}

function mysql_obj_Ncount($hMysql,$index)
{
    $res=$hMysql->rawQuery("select count(*) from account where id ".mysql_regexp($index)." and score!=-1;");
    if(!$res)
    {
        return false;
    }
    return (object)$res[0];
}

function mysql_obj_calculateAverageScore($hMysql,$index)
{
    $res=$hMysql->rawQuery("select avg(score) from account where id ".mysql_regexp($index)." and score!=-1;");
    if(!$res)
    {
        return false;
    }
    return (object)$res[0];
}
?>
