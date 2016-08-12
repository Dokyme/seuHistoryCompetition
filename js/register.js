window.onload = function()
{
	var auth_t=getCookie('auth')
    var id_t=getCookie('id')
    var right_t=getCookie('right')
    var score_t=getCookie('score')
    if(auth_t==null || id_t==null)
    {
        alert("error")
        logout()
    }
	if(right_t === "1")
	{
			document.getElementById("title").innerHTML = '<h1>考生注册</h1>';
			document.getElementById("contain1").innerHTML = '姓名:<input type="text" id="name"></input>';
			document.getElementById("contain2").innerHTML = '学号:<input type="text" id="studentnumber"></input>';
			document.getElementById("contain3").innerHTML = '一卡通号:<input type="text" id="ID"></input>';
			document.getElementById("contain4").innerHTML = '密码:<input type="password" id="password"></input>';
			document.getElementById("contain5").innerHTML = '确认密码:<input type="password" id="confirm_password"></input>';
			document.getElementById("contain7").innerHTML ='<img src="images/007.gif" width="288" height="50" style="cursor:pointer;" onclick="register_new_member()">'
			document.getElementById("contain8").innerHTML ='<img src="images/013.gif" width="288" height="50" style="cursor:pointer;" onclick="cancel()">'
			return;
		}
		else if(right_t === "0")
		{
			document.getElementById("title").innerHTML = '<h1>修改密码</h1>';
			document.getElementById("contain1").innerHTML = '学号:<input type="text" id="ID"></input>';
			document.getElementById("contain2").innerHTML = '旧密码:<input type="password" id="old_password"></input>';
			document.getElementById("contain3").innerHTML = '新密码:<input type="password" id="new_password"></input>';
			document.getElementById("contain4").innerHTML = '确认密码:<input type="password" id="confirm_password"></input>';
			document.getElementById("contain7").innerHTML ='<img src="images/007.gif" width="288" height="50" style="cursor:pointer;" onclick="alert_password()">'
			document.getElementById("contain8").innerHTML ='<img src="images/013.gif" width="288" height="50" style="cursor:pointer;" onclick="cancel()">'
			return;
		}
	else{logout();}
};

function register_new_member()
{
	var name_t=document.getElementById("name").value;
	var studentnumber_t=document.getElementById("studentnumber").value;
	var ID_t=document.getElementById("ID").value;
	var password_t=document.getElementById("password").value;
	var confirm_password_t=document.getElementById("confirm_password").value;
	if ( name_t=== null || name_t === "") {
		alert("请输入姓名！");
		return false;
		}
	if ( studentnumber_t=== null || studentnumber_t === "") {
		alert("请输入学号！");
		return false;
		}
	if ( ID_t=== null || ID_t === "" || ID_t.length !== 9) {
		alert("请输入正确的一卡通号！");
		return false;
		}
	if (password_t === null || password_t === "") {
		alert("请输入密码！");
		return false;
		}
	if (confirm_password_t === null || confirm_password_t === "") {
		alert("请确认密码！");
		return false;
		}
	if (confirm_password_t !== password_t) {
		alert("两次输入的密码不一致！");
		return false;
		}
	var xmlhttp;
	if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    } else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
	var obj={name:name_t,id:studentnumber_t,cardNum:ID_t,password:password_t};
	var params="req="+JSON.stringify(obj);
	xmlhttp.open("POST","register.php");
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.send(params);
	xmlhttp.onreadystatechange=function()
	{
		if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
		{
			var res=JSON.parse(xmlhttp.responseText)
			if(res.error==0)
			{
				alert("操作成功，学号："+res.id+"\n姓名："+res.name+"\n一卡通号："+res.cardNum+"\n密码："+res.password+"\n")
				window.location.href="index.html?ran=" + Math.random();
			}
			if(res.error==1)
			{
				alert("操作失败，"+res.msg);
			}
		}
	}
}
function alert_password()
{
	var ID_t=document.getElementById("ID").value;
	var old_password_t=document.getElementById("old_password").value;
	var new_password_t=document.getElementById("new_password").value;
	var confirm_password_t=document.getElementById("confirm_password").value;

	if ( ID_t != getCookie("id")) {
		alert("请输入正确的学号！");
		return false;
		}
	if (old_password_t === null || old_password_t === "") {
		alert("请输入旧密码！");
		return false;
		}
	if (new_password_t === null || new_password_t === "") {
		alert("请输入新的密码！");
		return false;
		}
	if (confirm_password_t === null || confirm_password_t === "") {
		alert("请确认密码！");
		return false;
		}
	if (confirm_password_t !== new_password_t) {
		alert("两次输入的密码不一致！");
		return false;
		}
	if (old_password_t === new_password_t) {
		alert("新旧密码不能一致！");
		return false;
		}
	var xmlhttp;
	if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    } else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
	var obj={id:ID_t,oldPassword:old_password_t,newPassword:new_password_t};
	var params="req="+JSON.stringify(obj);
	xmlhttp.open("POST","revisePassword.php");
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.send(params);
	xmlhttp.onreadystatechange=function()
	{
		if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
		{
			var res=JSON.parse(xmlhttp.responseText)
			if(res.error==0)
			{
				alert("操作成功，学号："+res.id+"\n姓名："+res.name+"\n一卡通号："+res.cardNum+"\n密码："+res.password+"\n请重新登陆")
				logout();
			}
			if(res.error==1)
			{
				alert("操作失败，"+res.msg);
			}
		}
	}
}
function exit_login(){
	clean_all_Cookie();
	window.location.href="index.html?ran=" + Math.random();
	}
function cancel(){
	window.location.href="index.html?ran=" + Math.random();
	}

function setCookie(name,value)
{
    var exp = new Date();
    exp.setTime(exp.getTime() + 3600000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function clean_all_Cookie(){
	delCookie("id");
	delCookie("password");
	delCookie("name");
	delCookie("right");
	delCookie("score");
	delCookie("auth");
}

function logout()
{
    clean_all_Cookie();
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
      xmlhttp = new XMLHttpRequest()
    }
    else
    {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xmlhttp.open('GET', 'logout.php')
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send()
    xmlhttp.onreadystatechange = function ()
    {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
        {
            window.location.href = 'index.html?ran=' + Math.random()
        }
    }
}
