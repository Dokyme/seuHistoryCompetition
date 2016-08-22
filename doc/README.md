# 东大校史爆破分队的Project
## 部署的参考：
[How To Install Linux, Nginx, MySQL, PHP (LEMP stack) in Ubuntu 16.04][1]
## MySQL中文乱码的问题解决办法
[MySQL中文乱码的问题解决办法][2]


## 具体步骤
```
sudo apt-get upgrade //升级包管理器
sudo apt-get update //更新
sudo apt-get install nginx //安装nginx
// 然后主站主页应该会显示nginx的默认网页
sudo apt-get install mysql-server //安装mysql服务器端
//　安装过程中会出现要输入root密码的提示框，输两次
sudoo mysql_install_db
sudo mysql_secure_installation //进行一些安全相关的设置，如果提示有设置密码安全策略的，选择0（最低策略）（不知道怎么回事我第二次安装的时候没有出现这个选项）
sudo apt-get install php5-fpm php5-mysql php5-cli　//安装php相关模块
sudo vi /etc/php5/fpm/php.ini　
/cgi.fix //把那项设置的注释去掉，并改为０
:wq //保存退出
sudo service php5-fpm restart　//重启服务
sudo vim /etc/nginx/sites-available/default

```
讲配置文件修改成如下
```
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.php index.html index.htm;

    server_name server_domain_name_or_IP;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```
```
:wq //保存退出
sudo service nginx restart //重启服务
sudo vim /usr/share/nginx/html/info.php
//添加如下几行
<?php
phpinfo();
?>
:wq //保存退出
//然后访问主站/info.php
```
出现如下的页面则说明时正确哒。
![此处输入图片的描述][3]
## 下面时redis的安装步骤
```
sudo add-apt-repository ppa:chris-lea/redis-server
sudo apt-get update
sudo apt-get install redis-server
redis-cli ping
//显示pong说明是正确哒。
sudo apt-get install php5-redis
sudo vim /etc/php5/fpm/php.ini
Ｇ //移动到文档末尾
// 添加下面一行
extension=redis.so
:wq
sudo service php5f-fpm restart
//然后刷新一下/info.php看看有没有专门的redis那一栏，有就说明时对哒。。。
```
## 然后是网站内容框架的设置
```
sudo apt-get install git //如果没有安装git的话
git clone https://github.com/ZouDikai/seuHistoryCompetition.git //目录随意，我就想放在/home/user目录下就可以了
sudo vim /etc/nginx/sites-available/default
//把相关的一行修改成这个样子。。。
root /home/ubuntu/seuHistoryCompetition;
:wq
sudo service nginx restart //重启nginx服务
sudo vim /etc/mysql/my.cnf
//在相应块下添加下面两句话（用来支持中文）
[client]
default-character-set=utf8
[mysqld]
character-set-server=utf8
:wq
sudo service mysql stop
sudo service mysql start
mysql -h localhost -u root -p
//输入密码
show variables like 'character_set_%';
//如果出现如下的表，则说明是正确哒。
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | utf8                       |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | utf8                       |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.01 sec)
//修改一下密码安全策略（这里完全是为了迎合我的怠惰，我的密码都是６个数字）
set global validate_password_policy=0;
set global validate_password_length=6;
//ctrl+c 退出
sudo chmod -R 777 seuHistoryCompetition
cd seuHistoryCompetition
sudo mysql -h localhost -p --local-infile < testDatabase.sql //权限问题我一直没有搞懂，既然它说权限不够那我就sudo吧。。

php main.php //向redis中写入试卷数据

//这是由于不同的mysql版本的目录不同所以需要修改
vim downloadXls.php
define('SOURCE_DIR', '/var/lib/mysql/seuHCDB/');
:wq
sudo chmod -R 777 /var/lib/mysql //又是权限问题。。。尴尬
```


  [1]: https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-in-ubuntu-16-04
  [2]: http://www.pc6.com/infoview/article_63586.html
  [3]: https://assets.digitalocean.com/articles/lemp_1404/php_info.png
