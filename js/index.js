window.onload = function ()
{
    var auth_t=getCookie('auth')
    var id_t=getCookie('id')
    var right_t=getCookie('right')
    var score_t=getCookie('score')
    var name_t=getCookie('name')
    if(auth_t==null||id_t==null||right_t===null||score_t==null||name_t==null) //如果ｃｏｏｋｉｅｓ信息不全的话
    {
        clean_all_Cookie();
    }
}

function login ()
{
    var ID_t = document.getElementById('ID').value
    var password_t = document.getElementById('password').value
    if (ID_t === null || ID_t === '' || ID_t.length >= 9 || ID_t.length <= 6)
    {
        alert('请输入正确的学号！')
        return false
    }
    if (password_t === null || password_t === '')
    {
        alert('请输入密码（默认为一卡通号）！')
        return false
    }
    request_for_login(ID_t, password_t)
}

function request_for_login (ID_t, password_t)
{
    clean_all_Cookie()
    var xmlhttp
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest()
    }
    else
    {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var params = 'id=' + ID_t + '&pw=' + password_t
    xmlhttp.open('POST', 'login.php')
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send(params)
    xmlhttp.onreadystatechange = function ()
    {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
        {
            var res = JSON.parse(xmlhttp.responseText)
            if (res.right === '-1')
            {
                alert('学号或密码错误！')
                return false
            }
            else
            {
                setCookie("name",res.name)
                setCookie("score",res.score)
                window.location.href="answersheet.html";
                return true;
            }
        }
    }
}

function downloadXls()
{
        var xmlhttp
        if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest()
        } else {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        var params="index="+getIndex();
        xmlhttp.open('POST', 'downloadXls.php')
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xmlhttp.send(params)
        xmlhttp.onreadystatechange=function()
        {
            if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
            {
                var res = JSON.parse(xmlhttp.responseText)
                if(res.error==1)
                {
                    alert(res.msg)
                    return;
                }
                window.location.href=res.dir;
            }
        }
}

function register () {
  window.location.href = 'register.html'
}

function exit_login () {
  clean_all_Cookie()
  window.location.href = 'index.html?ran=' + Math.random()
}

function setCookie (name, value) {
  var exp = new Date()
  exp.setTime(exp.getTime() + 3600000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

function getCookie (name) {
  var arr,reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

  if (arr = document.cookie.match(reg))

    return unescape(arr[2])
  else
    return null
}
function delCookie (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null)
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

function clean_all_Cookie ()
{
  delCookie('id')
  delCookie('password')
  delCookie('name')
  delCookie('right')
  delCookie('score')
  delCookie('auth')
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
