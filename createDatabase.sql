# 登陆数据库服务器 mysql -h localhost -u root -p
# 登陆数据库并运行脚本文件 mysql -h localhost -u root -p < Database.sql
# 删除数据库 drop database database_name;
# 删除用户 drop user user_name@localhost;
# 删除带有自增长主键的记录，并让自增长主键从1开始 truncate table table_name;
# 显示数据库位置的目录 show variables like '%dir%';
# 修改密码验证测量 set global validate_password_policy=0;
#               set global validate_password_length=6;
# 默认数据库文件位置 /var/lib/mysql/seuHCDB
# SELECT DISTINCT CONCAT('User: ''',user,'''@''',host,''';') AS query FROM mysql.user;

drop database if exists seuHCDB;
create database seuHCDB;
use seuHCDB;

create table account #创建用户表
(
    id char(9) not null primary key, # 学号
    cardNum int not null, # 一卡通号，我觉得没什么必要
    password char(32) not null, # 密码 默认一卡通号
    name char(20) not null,
    admin int not null, # 权限 1为辅导员 0为学生 -1为保留 默认为0
    score int not null # 得分 未答题默认为-1
);

create table multipleChoice #创建选择题表
(
    id int not null,
    question_description varchar(200) not null,
    choice_a char(100) not null,
    choice_b char(100) not null,
    choice_c char(100) not null,
    choice_d char(100) not null,
    answer char(2) not null,
    primary key(id)
);

create table judgement #创建判断题表
(
    id int unsigned not null,
    description varchar(200) not null,
    answer bit not null, #布尔型，1为对，0为错
    primary key(id)
);

# 创建一个用于操作用户信息的账户，一个获取题目的账户。

grant all privileges
on seuHCDB.account
to 'accounter'@'%' identified by '459861';

grant select
on seuHCDB.multipleChoice
to guest@localhost identified by '459861';

grant select
on seuHCDB.judgement
to guest@localhost;
