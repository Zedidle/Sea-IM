
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

