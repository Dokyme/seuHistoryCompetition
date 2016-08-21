var c1 = 10;

window.onload = function()
{
    var auth_t=getCookie("auth");
    var id_t=getCookie("id");
    var score_t=getCookie('score');
    var right_t=getCookie('right');
    if(auth_t==null||id_t==null)
    {
        alert("error")
        logout();
    }
    else if (right_t==1)
    {
        window.location.href = 'index.html?ran=' + Math.random()
    }
    else
    {
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp = new XMLHttpRequest();
        }
        else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET","score.php");
        xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function()
        {
            if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
            {
                var res = JSON.parse(xmlhttp.responseText);
                if(res.error==1) //如果查分意外失败
                {
                    alert("error");
                    logout()
                }
                else if(res.score==-1)
                {
                    alert("您尚未答题");
                    logout()
                }
                else
                {
                    setCookie("score",res.score);
                    document.getElementById('score_greeting').innerHTML = res.name + ' 同学你好！你已完成答题';
                    document.getElementById('score_grade').innerHTML = res.score;
                    timedCount1();
                }
            }
        }
    }
}

function timedCount1()
{
    if (c1 <= 1) {
        logout();
    } else {
        c1 = c1 - 1;
        setTimeout('timedCount1()', 1000);
        document.getElementById('score_close').innerHTML = c1 + '秒后自动退出';
    }
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

function clean_all_Cookie()
{
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
