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
    else //如果ｃｏｏｋｉｅｓ完整
    {
        redraw({id:id_t,right:right_t,score:score_t,name:name_t});
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
                redraw(res)
                return true;
            }
        }
    }
}

function start ()
{
    window.location.href = 'answersheet.html?ran=' + Math.random()
}

function redraw (res)
{
    var right_t = res.right
    var score_t = res.score
    if (right_t === '0' && score_t === '-1')
    {
        document.getElementById('000').removeChild(document.getElementById('sign'))
        document.getElementById('readnotice_welcome').innerHTML = '<h1>' + res.name + ' 同学你好！欢迎来到东南大学校史知识竞赛！</h1>'
        document.getElementById('readnotice_title').innerHTML = '<h1>注意事项</h1>'
        document.getElementById('readnotice_contain1').innerHTML = '<p>注意事项1</p>'
        document.getElementById('readnotice_contain2').innerHTML = '<p>注意事项2</p>'
        document.getElementById('startbutton').innerHTML = '<img src="images/006.gif" width="288" height="50" style="cursor:pointer;" onclick="start()">'
        document.getElementById('downloadbutton').innerHTML = '<img src="images/010.gif" width="288" height="50" style="cursor:pointer;" onclick="register()">'
        document.getElementById('exitbutton').innerHTML = '<img src="images/012.gif" width="288" height="50" style="cursor:pointer;" onclick="logout()">'
        return true;
    }
    if (right_t === '0' && score_t !== '-1')
    {
        window.location.href = 'score.html'
        return true
    }
    if (right_t === '1')
    {
        document.getElementById('000').removeChild(document.getElementById('sign'))
        document.getElementById('readnotice_welcome').innerHTML = '<h1>' + res.name + ' 老师你好！欢迎来到东南大学校史知识竞赛管理系统！</h1>'
        document.getElementById('readnotice_title').innerHTML = '<h1>注意事项</h1>'
        document.getElementById('readnotice_contain1').innerHTML = '<p>注意事项1</p>'
        document.getElementById('readnotice_contain2').innerHTML = '<p>注意事项2</p>'
        document.getElementById('startbutton').innerHTML = '<img src="images/005.gif" width="288" height="50" style="cursor:pointer;" onclick="register()">'
        document.getElementById('downloadbutton').innerHTML = '<img src="images/011.gif" width="288" height="50" style="cursor:pointer;" onclick="downloadXls()">'
        document.getElementById('exitbutton').innerHTML = '<img src="images/012.gif" width="288" height="50" style="cursor:pointer;" onclick="logout()">'
        return true
    }
}

function downloadXls()
{
    var id=getCookie('id')
    var re=new RegExp("^([0-9]{1,2})0{6}$")
    var index=re.exec(id)
        var xmlhttp
        if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest()
        } else {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        var params="index="+index[1];
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
                    alert("error")
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
