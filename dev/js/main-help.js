function v_domore_part_template(){
	return "<div id='domore'>"+
      "<div id='logOff' v-on:click='logOff'>注销</div>"+
      "<div id='person' v-on:click='getPersonInfo' class='ele' data-toggle='tooltip' data-placement='left' title='个人信息'>"+
        "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>"+
      "</div>"+
      "<div id='myteam' v-on:click='getTeamsInfo' class='ele' data-toggle='tooltip' data-placement='top' title='团队'>"+
        "<span class='glyphicon glyphicon-fire' aria-hidden='true'></span>"+
      "</div>"+
      "<div id='buildTeam' v-on:click='toBuildATeam' class='ele' data-toggle='tooltip' data-placement='bottom' title='创建团队'>"+
        "<span class='glyphicon glyphicon-grain' aria-hidden='true'></span>"+
      "</div>"+
      "</div>"
      ;
}
function v_user_info_template(){
	return "<div v-bind:class='{userinfo_wrap:true}'>"+
        "<div v-bind:class='{userinfo_avator:true}'>"+
          "<img v-bind:class='{userinfo_avator_img:true}' v-bind:src='info.headImg'>"+
        "</div>"+
        "<div id='intro' v-bind:class='{userinfo_intro:true}'>"+
          "<div id='name'>"+
            "<div id='nick_name'>{{info.name}}</div>"+
          "</div>"+
          "<div id='introduce' v-bind:class='{userinfo_introduce:true}'>{{info.introduce}}</div>"+
        "</div>"+
        "<div id='set' v-bind:class='{userinfo_set:true}' v-on:click='toggleDomore' >"+
          "<span class='glyphicon glyphicon-list' aria-hidden='true'></span>"+
        "</div>"+
      "</div>"
      ;
}

function v_search_content_template(){
	return "<div id='search-content' >"+
        "<div id='search' v-on:keyup.13='searchSubmit'>"+
          "<button id='sub' v-on:click='searchSubmit'>"+
            "<span class='glyphicon glyphicon-search' aria-hidden='true'></span>"+
          "</button>"+
          "<input type='text' id='search_uid' name='search_uid' placeholder='请输入团队或用户的ID'>"+
          "<div v-bind:class='{search_close:true}' v-on:click='closeCheckInfo'>"+
            "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>"+
          "</div>"+
        "</div>"+
      "</div>"
      ;
}

function v_createSearchTeamInfo_template(t){
	return "<div id='search-team'>"+
          "<div id='teamImg'>"+
          "<img src="+t.headImg+">"+
        "</div>"+
        "<div id='tinfo'>"+
          "<div id='teamname'>团队名: "+t.name+"</div>"+
          "<div id='builder'>ID: "+t.uid+"</div>"+
          "<div id='level'>级别: "+t.level+"</div>"+
          "<div id='membernumber'>人数: "+t.membernumber+"</div>"+
          "<div id='teamintro'>简介: "+t.introduce+"</div>"+
        "</div>"+
        "<div id='join'> "+
          "<span class='glyphicon glyphicon-map-marker' aria-hidden='true'></span>JOIN"+
        "</div>"+
      "</div>"
      ;
}

function v_createSearchPersonInfo_template(p){
	return "<div id='search-person'>"+
        "<div id='personImg'>"+
          "<img src="+p.headImg+">"+
        "</div>"+
        "<div id='pinfo'>"+
          "昵称: <div id='name'>"+p.name+"</div>"+
          "<div id='sex'>性别: "+p.sex+"</div>"+
          "<div id='hobby'>爱好: "+p.hobby+"</div>"+
          "<div id='personIntro'>简介: "+p.introduce+"</div>"+
        "</div>"+
        "<div id='send'> "+
         " <span class='glyphicon glyphicon-envelope' aria-hidden='true'></span>Mess"+
        "</div>"+
        "<div id='search-star'>"+
        "  <span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>Star"+
        "</div>"+
      "</div>"
      ;
}

function v_mess_li_template(){
	return "<ul v-bind:id='type'>"+
        "<li v-for='i in _info' v-on:click='show_messageFrame($event,i.uid,i.level)' :style='li_height(i.level)'>"+
          "<div class='info'>"+
            "<div class='name'>{{i.name}} "+
              "<span class='badge' v-if=!i.level>{{punR[i.uid]?punR[i.uid]:''}}</span> "+
              "<span class='badge' v-if=i.level>{{tunR[i.uid]?tunR[i.uid]:''}}</span>"+
            "</div>"+
            "<div class='li_type'>"+
              "<span v-if=i.level>team</span>"+
              "<span v-if=!i.level>people</span>"+
            "</div>"+
            "<span class='uid' >{{i.uid}}</span>"+
            "<div class='introduce'>{{i.introduce}}</div>"+
          "</div>"+
          "<div class='avator' :style='avator_w(i.level)'><img :src=i.headImg></div>"+
        "</li>"+
      "</ul>"
    ;
}


function v_teamMembers_template(li){
  return "<li> "+
              "<div class='avator'>"+
                "<img src="+li.headImg+"alt='UID:"+li.uid+"' title='UID:"+li.uid+"'>"+
              "</div>"+
              "<span class='name'>"+li.name+"</span>"+
         "</li>";
}

function judgeTypeforFloatDirection(msg,uid){
      var f;
      if(msg.type==='team'){
        f=(msg.from_user===uid)?"style='float:right'":"style='float:left'";
      }else{
        f=(msg.uid===uid)?"style='float:right'":"style='float:left'";
      }
      return f;
}


function v_createMessDiv(msg,f,msgContent){
  return "<div class='messli' "+f+">"+
          "<div class='avator' "+f+"><img src='"+msg.headImg+"'/></div>"+
          "<div class='info' "+f+">"+
            "<div>"+
              "<div class='name' "+f+">"+msg.name+" "+msg.time+"</div></div>"+
            "<div class='content' "+f+">"+msgContent+"</div>"+
         " </div>"+
        "</div>"
       ;
}

function v_addRecentLi_recent(con){
  return "<li style='height:"+con.h+";'>"+
          "<div class='info'>"+
            "<div class='name'>"+info.name+""+
              "<span class='badge'>1</span>"+
            "</div>"+
            "<div class='li_type'>"+
              "<span>"+con.type+"</span>"+
            "</div>"+
            "<span class='uid' >"+info.uid+"</span>"+
            "<div class='introduce'>"+info.introduce+"</div>"+
          "</div>"+
          "<div class='avator' style='width:"+con.avator_w+"; border-radius:"+con.borderR+";' ><img src='"+info.headImg+"'></div>"+
        "</li>"
      ;
}


function v_removeThePeopleInStar(id){
  var lis = document.getElementById('star').getElementsByTagName('li');
  for(var i=0;i<lis.length;i++){
    if(lis[i].querySelectorAll('.info .uid')[0].innerText===id){
      lis[i].parentNode.removeChild(lis[i]);
      break;
    }
  }
}

function v_addThePeopleInStar(info){
  $('#star').prepend(
      "<li v-on:click='show_messageFrame($event,"+info.uid+",false)' style='height:60px;'>"+
        "<div class='info'>"+
          "<div class='name'>"+info.name+" "+
            "<span class='badge'></span>"+
          "</div>"+
          "<div class='li_type'>"+
            "<span>people</span>"+
          "</div>"+
          "<span class='uid' >"+info.uid+"</span>"+
          "<div class='introduce'>"+info.introduce+"</div>"+
        "</div>"+
        "<div class='avator' style='width:60px;border-radius:50%;'>"+
          "<img src="+info.headImg+">"+
        "</div>"+
      "</li>"
    );
    $('#star li').first().click(function(){
      main.moreinfoSeen=false;
      main.messtype='star';
      main.messageframeSeen=true;
      main.isteam = false;
      main.nameOfmessageframe = this.getElementsByClassName('name')[0].innerText;
      main.messto = this.getElementsByClassName('uid')[0].innerText;
      document.getElementById('messageframe_cont').innerHTML = '';
    });
}

function v_removeThePeopleInRecent(id){
  var lis = document.getElementById('recent').getElementsByTagName('li');
  for(var i=0;i<lis.length;i++){
    if(lis[i].querySelectorAll('.info .uid')[0].innerText===id&&
      lis[i].querySelectorAll('.info .li_type span')[0].innerText!=='team'){
      lis[i].parentNode.removeChild(lis[i]);
      break;
    }
  }
}
function v_removeTheTeamInList(tid,li_type){
  var lis = document.getElementById(li_type).getElementsByTagName('li');
  for(var i=0;i<lis.length;i++){
    if(lis[i].querySelectorAll('.info .li_type span')[0].innerText==='team'&&
      lis[i].querySelectorAll('.info .uid')[0].innerText===tid){
      lis[i].parentNode.removeChild(lis[i]);
      break;
    }
  }
}
        function help_addFaceMark(){
          var t;
          switch(this.value){
            case 0:t = '呵呵'; break;
            case 1:t = '哈哈'; break;
            case 2:t = '吐舌'; break;
            case 3:t = '啊'; break;
            case 4:t = '酷'; break;
            case 5:t = '怒'; break;
            case 6:t = '开心'; break;
            case 7:t = '汗'; break;
            case 8:t = '泪'; break;
            case 9:t = '黑线'; break;
            case 10:t = '鄙视'; break;
            case 11:t = '不高兴'; break;
            case 12:t = '真棒'; break;
            case 13:t = '钱'; break;
            case 14:t = '疑问'; break;
            case 15:t = '阴险'; break;
            case 16:t = '吐'; break;
            case 17:t = '咦'; break;
            case 18:t = '委屈'; break;
            case 19:t = '花心'; break;
            case 20:t = '呼'; break;
            case 21:t = '笑眼'; break;
            case 22:t = '冷'; break;
            case 23:t = '太开心'; break;
            case 24:t = '滑稽'; break;
            case 25:t = '勉强'; break;
            case 26:t = '狂汗'; break;
            case 27:t = '乖'; break;
            case 28:t = '睡觉'; break;
            case 29:t = '惊哭'; break;
            case 30:t = '生气'; break;
            case 31:t = '惊讶'; break;
            case 32:t = '喷'; break;
            case 33:t = '爱心'; break;
            case 34:t = '心碎'; break;
            case 35:t = '玫瑰'; break;
            case 36:t = '礼物'; break;
            case 37:t = '彩虹'; break;
            case 38:t = '星星月亮'; break;
            case 39:t = '太阳'; break;
            case 40:t = '钱币'; break;
            case 41:t = '灯泡'; break;
            case 42:t = '咖啡'; break;
            case 43:t = '蛋糕'; break;
            case 44:t = '音乐'; break;
            case 45:t = 'haha'; break;
            case 46:t = '胜利'; break;
            case 47:t = '大拇指'; break;
            case 48:t = '弱'; break;
            case 49:t = 'ok'; break;
          }
          main.expressionSeen = false;
          var input = document.getElementById('messageframe_input');
          var end = input.selectionEnd;
          var iv = input.value;
          input.value = iv.substr(0,end) + "#("+t+")" + iv.substr(end,iv.length);
        } 


        function help_expressionSwitch(expressionMark){
  var t;
  switch(expressionMark){
    case '呵呵':t = 0; break;
    case '哈哈':t = 1; break;
    case '吐舌':t = 2; break;
    case '啊':t = 3; break;
    case '酷':t = 4; break;
              case '怒':t = 5; break;
              case '开心':t = 6; break;
              case '汗':t = 7; break;
              case '泪':t = 8; break;
              case '黑线':t = 9; break;
              case '鄙视':t = 10; break;
              case '不高兴':t = 11; break;
              case '真棒':t = 12; break;
              case '钱':t = 13; break;
              case '疑问':t = 14; break;
              case '阴险':t = 15; break;
              case '吐':t = 16; break;
              case '咦':t = 17; break;
              case '委屈':t = 18; break;
              case '花心':t = 19; break;
              case '呼':t = 20; break;
              case '笑眼':t = 21; break;
              case '冷':t = 22; break;
              case '太开心':t = 23; break;
              case '滑稽':t = 24; break;
              case '勉强':t = 25; break;
              case '狂汗':t = 26; break;
              case '乖':t = 27; break;
              case '睡觉':t = 28; break;
              case '惊哭':t = 29; break;
              case '生气':t = 30; break;
              case '惊讶':t = 31; break;
              case '喷':t = 32; break;
              case '爱心':t = 33; break;
              case '心碎':t = 34; break;
              case '玫瑰':t = 35; break;
              case '礼物':t = 36; break;
              case '彩虹':t = 37; break;
              case '星星月亮':t = 38; break;
              case '太阳':t = 39; break;
              case '钱币':t = 40; break;
              case '灯泡':t = 41; break;
              case '咖啡':t = 42; break;
              case '蛋糕':t = 43; break;
              case '音乐':t = 44; break;
              case 'haha':t = 45; break;
              case '胜利':t = 46; break;
              case '大拇指':t = 47; break;
              case '弱':t = 48; break;
              case 'ok':t = 49; break;
            }
            return t;
}