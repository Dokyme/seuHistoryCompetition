var start_time = new Date()
var sum_of_multipleChoice = 20;
var sum_of_judgement=10;
var number = new Array(sum_of_multipleChoice)
var multipleChoiceOrder=new Array(sum_of_multipleChoice);
var judgementOrder=new Array(sum_of_judgement);
var multipleChoiceAnswers=new Array(sum_of_multipleChoice);
var judgementAnswers=new Array(sum_of_judgement);
var choice = new Array('A', 'B', 'C', 'D')
var paper=new Object();

window.onload = function() //检查是否登陆（ａｕｔｈ），是否有答题的权限（）
{
    var auth_t=getCookie('auth')
    var id_t=getCookie('id')
    var right_t=getCookie('right')
    var score_t=getCookie('score')
    var name_t=getCookie('name')
    if(auth_t==null||id_t==null||right_t===null||score_t==null||name_t==null)
    {
        alert("权限错误，请重新登陆")
        logout()
    }
    else if (right_t === '0')
    {
        if (getCookie('score') === '-1') //如果ｓｃｏｒｅ＝－１，则应该答题
        {
            redraw({id:id_t,right:right_t,score:score_t,name:name_t});
            creater()
            //timedCount2()
        }
        else
        {
            window.location.href = 'score.html'; //否则跳到得分界面
        }
    }
    else if(right_t === '1')
    {
        redraw({id:id_t,right:right_t,score:score_t,name:name_t});
    }
    else
    {
        window.location.href = 'index.html?ran=' + Math.random()
    }
}

function timedCount2 ()
{
    var current_time = new Date()
    var c = 1800 - Math.floor((current_time.getTime() - start_time.getTime()) / 1000)
    if (c <= 0)
    {
        alert('考试时间结束，试卷已自动提交！')
        submitanswer()
    }
    else
    {
        var minutes = Math.floor(c / 60)
        var seconds = c - minutes * 60
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        document.getElementById('timertext').innerHTML = minutes + ':' + seconds
    }
    setTimeout('timedCount2()', 500)
}

function creater ()
{
    var xmlhttp
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest()
    }
    else
    {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xmlhttp.open('GET', 'answersheet.php')
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send()
    xmlhttp.onreadystatechange = function ()
    {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
        {
            paper=JSON.parse(xmlhttp.responseText)
        }
    }
}

function removeNotice()
{
    document.getElementById("answersheet_001").removeChild(document.getElementById("readnotice"));
}

function start ()
{
    removeNotice();
    if(paper.error==1)
    {
        alert(paper.msg)
        return 0;
    }
    var multipleChoice=paper.multipleChoice;
    var judgement=paper.judgement;
    multipleChoiceOrder=flush(sum_of_multipleChoice);
    judgementOrder=flush(sum_of_judgement);
    var order=multipleChoiceOrder;
    for (var i = 0;i < sum_of_multipleChoice;i++)
    {
        var dex = i + 1
        if (dex < 10) {dex = '0' + dex;}
        document.getElementById('questions' + dex).innerHTML = '<form><p class="question_description">' + dex + '.' + multipleChoice[order[i]].question_description + '</p><input name="answer" type="radio" class="question_choice" id ="' + i + '_0">' + multipleChoice[order[i]].choice_a + '</input><br><input name="answer" type="radio" class="question_choice" id ="' + i + '_1">' + multipleChoice[order[i]].choice_b + '</input><br><input name="answer" type="radio" class="question_choice" id ="' + i + '_2">' + multipleChoice[order[i]].choice_c + '</input><br><input name="answer" type="radio" class="question_choice" id ="' + i + '_3">' + multipleChoice[order[i]].choice_d + '</input><br></form>';
                //setCookie('question' + i, res[order[i]].answer)///////////////////////////////////////..////.
        multipleChoiceAnswers[i]={id:multipleChoice[order[i]].id,choice:-1};
    }
    order=judgementOrder;
    for (var i = 0;i < sum_of_judgement;i++)
    {
        var dex = i + 1
        if (dex < 10) {dex = '0' + dex;}
        document.getElementById('judgement' + dex).innerHTML = '<form><p class="question_description">' + dex + '.' + judgement[order[i]].question_description + '</p><input name="answer" type="radio" class="question_choice" id ="' + (i+20) + '_0">正确</input><br><input name="answer" type="radio" class="question_choice" id ="' + (i+20) + '_1">错误</input><br></form>';
                //setCookie('question' + i, res[order[i]].answer)///////////////////////////////////////..////.
        judgementAnswers[i]={id:judgement[order[i]].id,choice:-1};
    }
    document.getElementById("timeri").innerHTML='<img src="images/008.gif" width="320" height="60">';
    document.getElementById("timert").innerHTML='<h1 id="timertext" style="color:white;font-size: 260%;">00:00</h1>';
    document.getElementById("submitter").innerHTML='<img src="images/009.gif" width="320" height="60" style="cursor:pointer;" onclick="IsSuretoSubmit()">';
    start_time = new Date()
    timedCount2()
}

function redraw (res)
{
    var right_t = res.right
    var score_t = res.score
    if (right_t === '0' && score_t === '-1')
    {
        //document.getElementById('000').removeChild(document.getElementById('sign'))
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
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
          xmlhttp = new XMLHttpRequest()
        }
        else
        {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xmlhttp.open('POST', 'calculate.php')
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xmlhttp.send('index='+getIndex())
        xmlhttp.onreadystatechange = function ()
        {
            if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
            {
                var res=JSON.parse(xmlhttp.responseText)
                if (res.right === '-1')
                {
                    alert('权限错误，请重新登陆')
                    logout();
                }
                else
                {
                    var info=res;
                    //document.getElementById('000').removeChild(document.getElementById('sign'))
                    document.getElementById('readnotice_welcome').innerHTML = '<h1>' + getCookie('name') + ' 老师你好！欢迎来到东南大学校史知识竞赛管理系统！</h1>'
                    document.getElementById('readnotice_title').innerHTML = '<h1>年级总人数:'+info.count+'</h1>'
                    document.getElementById('readnotice_contain1').innerHTML = '<p>已答题人数:'+info.countW+'</p>'
                    document.getElementById('readnotice_contain2').innerHTML = '<p>已答题均分:'+info.average+'</p>'
                    document.getElementById('startbutton').innerHTML = '<img src="images/005.gif" width="288" height="50" style="cursor:pointer;" onclick="register()">'
                    document.getElementById('downloadbutton').innerHTML = '<img src="images/011.gif" width="288" height="50" style="cursor:pointer;" onclick="downloadXls()">'
                    document.getElementById('exitbutton').innerHTML = '<img src="images/012.gif" width="288" height="50" style="cursor:pointer;" onclick="logout()">'
                }
            }
        }

        return true
    }
}

function flush(sum)
{
    var number=new Array(sum);
    var order=new Array(sum);
    for(var i=0;i<sum;i++)
    {
        number[i]=i;
    }
    for(var i=0;i<sum;i++)
    {
        var temp=Math.floor(Math.random()*(number.length));
        order[i] = number[temp]
        for (var j = temp;j < number.length - 1;j++)
        {
            number[j] = number[j + 1];
        }
        number.pop();
    }
    return order;
}

function get_judge(index) //20-29
{
    for(var i=0;i<2;i++)
    {
        if(document.getElementById(index+'_'+i).checked)
        {
            return i;
        }
    }
    return -1;
}

function get_check(index) //0-19
{
    for(var i=0;i<4;i++)
    {
        if(document.getElementById(index+'_'+i).checked)
        {
            return i;
        }
    }
    return -1;
}

function getIndex()
{
    var id=getCookie('id')
    var re=new RegExp("^([0-9]{1,2})0{6}$")
    var index=re.exec(id)
    return index[1];
}

function submitanswer ()
{
    delCookie('score')
    for (var i = 0;i < sum_of_multipleChoice;i++) //{if (answer_check(i)) {grade = grade + 5;}}
    {
        multipleChoiceAnswers[i].choice=get_check(i);
    }
    for (var i = 0;i < sum_of_judgement;i++) //{if (answer_check(i)) {grade = grade + 5;}}
    {
        judgementAnswers[i].choice=get_judge(i+20);
    }
    var xmlhttp
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest()
    }
    else
    {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var params=JSON.stringify({multipleChoiceAnswer:multipleChoiceAnswers,judgementAnswer:judgementAnswers});
    xmlhttp.open('POST', 'submit.php')
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send("req="+params)
    xmlhttp.onreadystatechange = function ()
    {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200))
        {
            var res = JSON.parse(xmlhttp.responseText)
            if(res.error==1)
            {
                alert(res.msg)
            }
            else
            {
                setCookie('score', res.score);
                window.location.href = 'score.html';
            }
        }
    }
}

function register () {
  window.location.href = 'register.html'
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

function IsSuretoSubmit ()
{
  var mes = confirm('是否确认提交试卷？')
  if (mes === true) {submitanswer();}
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

function end () {
  clean_all_Cookie()
  window.location.href = 'index.html?ran=' + Math.random()
}

function clean_all_Cookie () {
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
