# 这个是向数据库添加测试数据的sql脚本
# 名字随便起的。。。。。。不要在意这些细节。。。。。。
use seuHCDB;
/*
insert into account
values
(213151752,'459861','邹迪凯',0,-1),
(213151753,'459862','辅导员xxx',1,-1),
(666666,'666666','邹迪凯的女票',0,100);
*/
/*
insert into multipleChoice (description,choice_a,choice_b,choice_c,choice_d,answer)
values
('东南大学前身最早可以追溯到清朝末期的：','南洋公学','京师大学堂','三江师范学堂','北洋学堂','c'),
('1905年至1911年，李瑞清出任两江师范学堂监督（校长），他主政期间提出的校训是什么？','嚼得菜根，做得大事','嚼得大事，做得菜梗','俭朴、勤奋、诚笃','独立思考，崇实务本','a');
*/

load data local infile 'multipleChoiceTest.csv' into table multipleChoice
fields terminated by ',';

load data local infile 'judgementTest.csv' into table judgement
fields terminated by ',';

load data local infile 'testUserData.csv' into table account
fields terminated by ',';
