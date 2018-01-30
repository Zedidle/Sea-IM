
function vCreateSearchTeamInfoTemplate(t){
  if(t){
    return "<div id='teamImg'>"+
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
      "</div>";
  }else{
    return "<div class='alert alert-danger' role='alert'>没有团队</div>";
  }
}

function vCreateSearchPersonInfoTemplate(p){
  if(p){
    return "<img id='personImg' src="+p.headImg+">"+
      "<div id='pinfo'>"+
        "昵称: <div id='name'>"+p.name+"</div>"+
        "<div id='sex'>性别: "+p.sex+"</div>"+
        "<div id='hobby'>爱好: "+p.hobby+"</div>"+
        "<div id='personIntro'>简介: "+p.introduce+"</div>"+
      "</div>"+
      "<button id='send'> "+
       " <span class='glyphicon glyphicon-envelope' aria-hidden='true'></span>Mess"+
      "</button>"+
      "<button id='search-star'>"+
      "  <span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>Star"+
      "</button>";
  }else{
    return "<div class='alert alert-warning' role='alert'>找不到用户</div>";
  }
}



function vTeamMembersTemplate(li){
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

function vCreateMessDiv(msg,f,msgContent){
  return "<div class='messli' "+f+">"+
            "<div class='avator' "+f+">"+
              "<img src='"+msg.headImg+"'/>"+
            "</div>"+
            "<div class='info' "+f+">"+
              "<div class='name' "+f+">"+msg.name+" "+msg.time+"</div>"+
              "<div class='content' "+f+">"+msgContent+"</div>"+
            "</div>"+
          "</div>"
          ;
}

// function vAddRecentLi(con,info){
//   return "<li style='height:"+con.h+";'>"+
//           "<div class='info'>"+
//             "<div class='name'>"+info.name+""+
//               "<span class='badge'>1</span>"+
//             "</div>"+
//             "<div class='li_type'>"+
//               "<span>"+con.type+"</span>"+
//             "</div>"+
//             "<span class='uid' >"+info.uid+"</span>"+
//             "<div class='introduce'>"+info.introduce+"</div>"+
//           "</div>"+
//           "<div class='avator' style='width:"+con.avator_w+"; border-radius:"+con.borderR+";' ><img src='"+info.headImg+"'></div>"+
//         "</li>"
//       ;
// }


function vRemovePersonInStar(id){
  var lis = document.getElementById('star').getElementsByTagName('li');
  for(i=0;i<lis.length;i++){
    if(lis[i].querySelectorAll('.info .uid')[0].innerText===id){
      lis[i].parentNode.removeChild(lis[i]);
      break;
    }
  }
}

function vAddPersonInStar(info){
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
      main.nameOfmessageframe = this.getElementsByClassName('name')[0].innerText;
      main.messto = this.getElementsByClassName('uid')[0].innerText;
      document.getElementById('messageframe_cont').innerHTML = '';
    });
}

function vRemoveThePeopleInRecent(id){
  // var lis = document.getElementById('recent').getElementsByTagName('li');
  // for(i=0;i<lis.length;i++){
  //   if(lis[i].querySelectorAll('.info .uid')[0].innerText===id&&
  //     lis[i].querySelectorAll('.info .li_type span')[0].innerText!=='team'){
  //     lis[i].parentNode.removeChild(lis[i]);
  //     break;
  //   }
  // }
}

function vRemoveTheTeamInList(tid,li_type){
  var lis = document.getElementById(li_type).getElementsByTagName('li');
  for(i=0;i<lis.length;i++){
    if(lis[i].querySelectorAll('.info .li_type span')[0].innerText==='team'&&
      lis[i].querySelectorAll('.info .uid')[0].innerText===tid){
      lis[i].parentNode.removeChild(lis[i]);
      break;
    }
  }
}

function expressionImageToText(){
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
  var input = document.getElementById('messageframe-input');
  var end = input.selectionEnd;
  var v = input.value;
  input.value = v.substr(0,end) + "#("+t+")" + v.substr(end,v.length);
} 


function expressionTextToImage(expressionMark){
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