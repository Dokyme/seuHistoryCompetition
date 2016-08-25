<?php

require_once("../lib/redis_method.php");
require_once("../lib/mysql_method.php");
$str=
"
{\"multipleChoiceAnswer\":{\"102\":\"c\",\"103\":\"d\",\"54\":\"c\",\"55\":\"d\",\"88\":\"a\",\"89\":\"b\",\"180\":\"a\",\"181\":\"b\",\"120\":\"a\",\"121\":\"b\",\"196\":\"a\",\"197\":\"b\",\"26\":\"c\",\"27\":\"d\",\"154\":\"c\",\"155\":\"d\",\"142\":\"c\",\"143\":\"d\",\"108\":\"a\",\"109\":\"b\"},\"judgementAnswer\":{\"102\":\"0\",\"103\":\"1\",\"54\":\"1\",\"55\":\"1\",\"88\":\"1\",\"89\":\"1\",\"180\":\"1\",\"181\":\"1\",\"120\":\"1\",\"121\":\"1\"}}
";
$hMysql=mysql_h_connect("guest");
$hRedis=redis_h_connect();
$array=object_array(json_decode($str));
//var_dump(mysql_obj_getJudgementAnswer($hMysql,0)->answer);
//echo redis_json_getAnswerList($hRedis,0);
echo object_array(json_decode(redis_json_getAnswerList($hRedis,0)))["multipleChoiceAnswer"][102];

function object_array($array)
{
    if(is_object($array)) {
        $array = (array)$array;
     } if(is_array($array)) {
         foreach($array as $key=>$value) {
             $array[$key] = object_array($value);
             }
     }
     return $array;
}
?>
