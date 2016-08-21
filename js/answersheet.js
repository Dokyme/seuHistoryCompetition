var start_time = new Date()
var sum_of_multipleChoice = 20;
var sum_of_judgement=10;
var number = new Array(sum_of_multipleChoice)
var multipleChoiceOrder=new Array(sum_of_multipleChoice);
var judgementOrder=new Array(sum_of_judgement);
var multipleChoiceAnswers=new Array(sum_of_multipleChoice);
var judgementAnswers=new Array(sum_of_judgement);
var choice = new Array('A', 'B', 'C', 'D')

window.onload = function() //检查是否登陆（ａｕｔｈ），是否有答题的权限（）
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
    else if (right_t === '0')
    {
        if (getCookie('score') === '-1') //如果ｓｃｏｒｅ＝－１，则应该答题
        {
            creater()
            timedCount2()
        }
        else
        {
            window.location.href = 'score.html'; //否则跳到得分界面
        }
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
            var res = JSON.parse(xmlhttp.responseText)
            var multipleChoice=res.multipleChoice;
            var judgement=res.judgement;
            if(res.error==1)
            {
                alert("error")
                logout()
            }
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
        }
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
                alert("error")
            }
            else
            {
                setCookie('score', res.score);
                window.location.href = 'score.html';
            }
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
