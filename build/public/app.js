const Domore2 = {
	template:`<div>Test Domore</div>`
}


const router = new VueRouter({
	routes: [
	  // 动态路径参数 以冒号开头
	  { path: '/domore', component: Domore2 }
	]
})

const store = new Vuex.Store({
  state: {
    count: 0,
    userinfo: false,
    talkskip: false,
    isWantToLogOff:false,

    moreInfo:{
      headImg:'',
      uid:'',
      name:'',
      level:'',
      memeber:'',
      sex:'',
      hobby:'',
      birthday:'',
      introduce:''
    },

    isDomore:false,
    moreinfoSeen:false,
    teamMembersSeen:false,
    messtype:'',
    messto:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    expressionSeen:false,
    messShowType:'recent',
    
    userInfo:false,
    recentInfo:false,
    starInfo:false,
    teamInfo:false,







	name:name||false,
	personHeadImage:false,
	introduce:false,
	sex:false,
	hobby:false,
	birthday:false,
	subBtnText:'更新',
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});

store.commit('increment');

console.log("store.state.count:" + store.state.count) // -> 1
var app = new Vue({
	el:'#app',
	router,
	store,
	components:{

	},
	data:{
		t:'SeaNet Application'
	},
	computed:{
		tt:function(){
			return store.state.count;
		}
	},
	methods:{

	},
	watch:{

	}
})
var Main = new Vue({
  components:{
    'domore-part':Domore,
    'user-info':UserInfo,
    'search-content':Search,
    'mess-lis':MessList
  },
  

  template:`
<body>
  <div
    id='main'
  >
    <div id="content" >
      <domore-part></domore-part>
      <div id="checkMess" >
      <user-info
        v-bind:info='userInfo'
      ></user-info>
      <search-content></search-content>
      <div id="messOption" v-on:click='hideDomore'>
        <div 
          v-on:click="listSeen($event,'recent')" 
          id='recentOption' 
          class='sOption'
        >
          <span 
            class="glyphicon glyphicon-pencil" 
            aria-hidden="true"
          ></span>
        </div>
        <div 
          v-on:click="listSeen($event,'star')" 
          id='starOption' 
          class='sOption'
        >
          <span 
            class="glyphicon glyphicon-star" 
            aria-hidden="true"
          ></span>
        </div>
        <div 
          v-on:click="listSeen($event,'team')" 
          id='teamOption'
          class='sOption'
          >
          <span
            class="glyphicon glyphicon-fire"
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div
        id="messContent"
        v-on:click='hideDomore'
      >
        <div
          v-show="messShowType === 'recent'"
          id="recentContent"
          class='sContent'
        >
          <mess-lis 
            type='recent'
            v-bind:info = 'recentInfo'
          ></mess-lis>
        </div>
        <div
          v-show="messShowType === 'star'"
          id="starContent"
          class='sContent'
        >
          <mess-lis
            type='star'
            v-bind:info = 'starInfo'
          ></mess-lis>
        </div>
        <div
          v-show="messShowType === 'team'"
          id="teamContent"
          class='sContent'
        >
          <mess-lis
            type = 'team'
            v-bind:info = 'teamInfo'
          ></mess-lis>
        </div>
      </div>
    </div>
  </div>
</div>

  <footer
      style='position:fixed;
          height:10px;
          display:block;
          width:100%;
          bottom:2%;   
          text-align:center;'
  >
  <ul
      style='list-style: none;padding:0;margin:0;'
  >
      <li>@SeaNet</li>
  </ul>
  </footer>



  <script>
    /*声音资源*/


    var UserInfo = JSON.parse(jsonKeep("<%=user_info%>"));
    var Loginlist = JSON.parse(jsonKeep('<%=loginlist%>'));
    var PunRead = JSON.parse(jsonKeep('<%=punRead%>'));
    var TunRead = JSON.parse(jsonKeep('<%=tunRead%>'));
    var RecentInfo = JSON.parse(jsonKeep('<%=recentinfo%>'));
    var StarInfo = JSON.parse(jsonKeep('<%=starinfo%>'));
    var TeamInfo = JSON.parse(jsonKeep('<%=teaminfo%>'));

    for(var i of RecentInfo){
      var isTeam = Boolean(RecentInfo.level);
      var uid = i.uid;
      i.unread = (isTeam)?TunRead[uid]:PunRead[uid];    
    }

    for(var i of StarInfo){
      i.unread = PunRead[i.uid];
    }

    for(var i of TeamInfo){
      i.unread = TunRead[i.uid];
    }
  </script>


  <script>
  
    var socket = io();
    
    //var UID = localStorage.getItem('UID');
    var UID = sessionStorage.getItem('UID');
    var UserEnsure = {
      uid:UID
    };

    console.log(UID);

    if(!UID){
      localStorage.setItem('UID','wait');
      sessionStorage.setItem('UID','wait');
      window.location.href = '/';
    }

    //listen the port of the user,
    socket.on(UID,function(J_msg){
      main.messageCome(JSON.parse(J_msg)); 
    });

    //every 10 seconds to send a heartbeat package , keep on line;
    setInterval(function(){
      socket.emit('heartbeat',UID);
    },10000);
    
  </script>

</body>
`
,
  methods:vMethods()
});






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
function vMethods(){
  return {

    //确认注销的话，就会销毁localStorage的用户登录记录
    ensureLogOff:function(){
      localStorage.removeItem('UID');
      sessionStorage.removeItem('UID');
      zPost('/logOff',UserEnsure);
    },
    cancelLogOff:function(){
      this.isWantToLogOff = false;
    },


    closeMoreinfo:function(){
      this.moreinfoSeen=false;
    },

    getMoreInfo:function(){
      console.log('2333');

      var data = {
        type:this.messtype,
        uid:this.messto
      };

      console.log('getMoreInfo');
      console.log(data);


      //无法查询团队信息,会引起系统崩溃!
      $.get("/getInfo",data,function(info){
        console.log(info);
        //这里的数据格式同后台数据库一致，可以直接绑定到Vue对应的data对象上
        main.moreInfo = info;
        console.log(main.moreInfo);
      });
      this.moreinfoSeen = true;
    },

    getMoreMessage:function(){
      //读取现有信息长度
      var skip = document.querySelectorAll('#messageframe-cont>.messli').length;
      console.log(skip);

      var data = {
        receiveUid:UID,
        fromUid:main.messto,
        type:main.messtype
      };

      //获取更多聊天记录
      $.post('/getMoreMessage', data, function(messages){
        
        console.log(messages);

        if(messages){
          var l = messages.length;
          for(var i=0;i<5;i++){
            //这里的做法是把与对方的聊天消息一次全部拿出来
            //再慢慢读取
            main.createMessDiv(messages[l-1-skip-i], true);
          }
        }else{
          main.noMoreMessage();
        }
      });
    },

    //没有更多聊天记录的提示
    noMoreMessage:function(){
        var getMessBtn = $('.getMoreMessageOnFrame-btn')[0];
        getMessBtn.innerText = 'No More';
        setTimeout(function(){
          getMessBtn.innerText = 'Get More Message';
        },1500);
    },

    //when the mess come, if messageFrame is opning, check the messtype and messto, 
    //if satisfy the condition, it will run this function to show the message.
    //插入新消息到消息内容框
    //isTop判断是否要上插并滚动到最顶
    createMessDiv:function(msg, isTop){

      if(!msg){
        this.noMoreMessage();
        return false;
      }

      //根据类型和消息来源判断消息框浮动方向
      var f = judgeTypeforFloatDirection(msg, UID);
      console.log(msg);
      
      //获取消息内容框对象
      var cont = $('#messageframe-cont')[0];
        
      //转翻译表情信息
      var msgContent = main.expressionsParse(msg.content);

      if(isTop){
        $(cont).prepend(vCreateMessDiv(msg, f, msgContent));
        cont.scrollTop = 0; 
      }else{
        
        //添加消息到内容框
        $(cont).append(vCreateMessDiv(msg, f, msgContent));
        
        //清空输入框
        $('#messageframe-input')[0].value = '';
        
        //置顶
        cont.scrollTop = cont.scrollHeight;
      }

    },

    expressionsParse:function(msgContent){
      while(msgContent.match(/\#\(.{1,4}\)/)){
        var msgMatch = String(msgContent.match(/\#\(.{1,4}\)/));
        
        console.log(msgMatch.slice(2,-1));
        var t = expressionTextToImage(msgMatch.slice(2,-1));

        msgContent = msgContent.replace(
          /#\(.{1,4}\)/,
          `<div
            class='expression-chatting'
            style='background-image:url(img/faces.png); 
              background-position:0px -${t*30}px;'
          >
          </div>`
          );
      }
      return msgContent;
    },



    messageContentOnScroll:function(event){
      // console.log(event);
      
    },

    unReadAdd1InDB:function(msgType,msgUid,msgTo){
      var data = {
        type:msgType,
        uid:msgUid,
        to:msgTo,
        checked:false
      };
      $.post('/unReadAdd1',data);
    },


    addUnRead:function(msg){
      var msgUid = msg.uid;

      this.dealUnread(msgUid, true);
      this.unReadAdd1InDB(msg.type, msg.uid, msg.to);
    },  




    //when user receive any message, run this function;
    messageCome:function(msg){

      console.log(msg);
      if((msg.uid===main.messto) && (msg.type===main.messtype||
          msg.type!=='team' && main.messtype==='star')||
          msg.uid===UID && msg.type!=='team'){
          
          this.createMessDiv(msg, false);
          console.log(1);

        if(msg.uid===uid&&msg.type==='team'&&main.messto!==msg.uid){
          this.addUnRead(msg);
          console.log(2);
        }


      }else{

        if(msg.type==='team'){
          TeamMessageCome.play();
        }else{
          PersonMessageCome.play();
        }

          console.log(3);
        this.addUnRead(msg);
      }

      //判断是否存在于最近联系
      var existInRecent = false;

      if(msg.type==='team'){
        //check whether the recent_team exist;
        var lrt = Loginlist.recent_team;
        for(i=0;i<lrt.length;i++){
          if(lrt[i]===msg.uid||lrt[i]===msg.to){
            existInRecent = true;
            break;
          }
        }

      }else{

        //check whether the recent_people exist;
        var lrp = Loginlist.recent_people;
        for(i=0;i<lrp.length;i++){
          if(lrp[i]===msg.uid||lrp[i]===msg.to){
            existInRecent = true;
            break;
          }
        }
      }


      if(!existInRecent){
        console.log(4);
        if(msg.uid===UID){
          //who send msg and who receive msg is the same;

          //无论如何都要读取对方消息
          var data = {  
            uid:msg.to, 
            type:msg.type
          };

          $.get('/getInfo',data,function(info){
            if(msg.type==='team'){
              Loginlist.recent_team.push(msg.uid);
            }else{
              Loginlist.recent_people.push(msg.to);
            }

            info.unread = 0;
            main.addRecentLi(info);
          
          });

        }else{
          if(msg.type==='team'){
            Loginlist.recent_team.push(msg.uid);
          }else{
            Loginlist.recent_people.push(msg.uid);
          }
          msg.unread = 1;
          this.addRecentLi(msg);
        }
      }
    },

    addRecentLi:function(info){
      main.recentInfo.unshift(info);

      if(main.messtype === 'team'){
        Loginlist.recent_team.unshift(info.uid);
      }else{
        Loginlist.recent_people.unshift(info.uid);
      }

    },
    removeRecentLi:function(data){
      console.log('removeRecentLi:');

      console.log(this.recentInfo[0]);

      var i;

      for(i=0;i<this.recentInfo.length;i++){
        if(this.recentInfo[i].uid=== data.to &&
           (this.recentInfo[i].type === 'people'||
            this.recentInfo[i].type === 'recent')){
          this.recentInfo.splice(i,1);
          break;
        }
      }

      //同时完成Loginlist的更改
      if(data.type ==='team'){
        for(i=0;i<Loginlist.recent_team.length;i++){
          if(Loginlist.recent_team[i] === data.to){
            Loginlist.recent_team.splice(i,1);
            break;
          }
        }
      }else{
        for(i=0;i<Loginlist.recent_people.length;i++){
          console.log(Loginlist.recent_people[i]);
          console.log(data.to);
          console.log(Loginlist.recent_people[i] === data.to);
          if(Loginlist.recent_people[i] === data.to){
            console.log(2333);
            Loginlist.recent_people.splice(i,1);
            console.log(Loginlist.recent_people);
            break;
          }
        }
      }

    },

    showExpressions:function(){
      this.expressionSeen = !this.expressionSeen;

      var faces = document.querySelector('.messageframe-expression');
      faces.innerHTML = '';
     
      for(var i=0;i<50;i++){
        var d = document.createElement('div');
        d.style.backgroundPosition = 'left -'+i*30+'px';    
        d.style.backgroundImage = 'url(img/faces.png)'; 
        d.value = i;
        d.onclick = expressionImageToText;
        faces.appendChild(d);
      }
    },

    //发送消息
    sendMessage:function(){
      var v = document.getElementById('messageframe-input').value.trim();
      if(v.length){
        var msg = {
          time:mTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:UID
        };
        socket.emit('chat', JSON.stringify(msg));
      }
    },

    starOrUnstar:function(){
      var stars = Loginlist.star;
      var data = {
        uid:UID,
        to:main.messto,
        isStar:false,
      };
      for(var i=0;i<stars.length;i++){
        if(stars[i]===main.messto){
          data.isStar = true;
          break;
        }
      }

      $.post('/starOrUnstar', data, function(data_back) {
        if(data.isStar){
          vRemovePersonInStar(data.to);
          Loginlist.star.pull(data.to);
        }else{
          vAddPersonInStar(data_back);
          Loginlist.star.push(data.to);
        }
      });
    },

    deleteTheRecentChat:function(){
      var data = {
        uid:UID,
        type:main.messtype,
        to:main.messto
      };
      $.post('/deleteRecentChat',data,function(d){
        main.removeRecentLi(data);
      });

      main.messageframeClose();
    },

    exitTeam:function(){
      if(confirm('确认退出该团队？')){
        var data = {
          uid:uid,
          tid:main.messto
        };
        $.post('/exitTeam', data, function(){
          vRemoveTheTeamInList(data.tid,'recent');
          vRemoveTheTeamInList(data.tid,'team');
          main.messageframeClose();
        });
      }
    },

    showMembers:function(){
      main.teamMembersSeen = true;
      $.get('/showMembers',{ tid:main.messto }, function(_infos) {
        var teamMembers_ul = document.querySelector('.teamMembers>ul');
        for(var i=0;i<_infos.length;i++){
          $(teamMembers_ul).append(vTeamMembersTemplate(_infos[i]));         
        }
      });
    },

    closeTeamMembers:function(){
      document.querySelector('.teamMembers>ul').innerHTML = '';
      this.teamMembersSeen = false;
    },

    //when the < of the top of left of the massageframe be clicked, run this function,
    messageframeClose:function(){
      this.messageframeSeen=false;
      this.teamMembersSeen=false;
      this.messtype='';
      this.messto='';

      $('.messageframe')[0].style.height = '0%';
      $('#messageframe-cont')[0].innerHTML = '';
      $('#messageframe-input')[0].value = '';
    },

    //hide the domore model,
    hideDomore:function(){
      $('#domore')[0].style.width = '0px';
      $('#domore').j = false;
    },

    listSeen:function(event,type){
      $('.sOption>span').css('color','#fff');
      var target = event.target.querySelector('span')||event.target;
      $(target).css('color','#60DDFF');
      this.messShowType = type;
    },

    //参数bool判断是否需要增加对应的未读数量
    dealUnread:function(uid, bool=false){
      if(this.isTeam){
        for(let i of this.teamInfo){
          if(i.uid === uid){
            if(bool){
              i.unread++;
            }else{
              i.unread = 0;
            }
            break;
          }
        }
      }else{
        for(let i of this.recentInfo){
          if(i.uid === uid && i.type !=='team'){
            if(bool){
              i.unread++;
            }else{
              i.unread = 0;
            }
            break;
          }
        }

        for(let i of this.starInfo){
          if(i.uid === uid){
            if(bool){
              i.unread++;
            }else{
              i.unread = 0;
            }
            break;
          }
        }
      }
    },
  };
}
var People = new Vue({
     data:{

     },
     methods:{
          backToMainPage:function(){
               zPost('/main',UserEnsure);
          },
          showPersonHeadForm:function(){
             $('#peopleHeadForm')[0].style.display = 'block';
          },
          showCheckImg:function(){
               $('#checkImg')[0].style.height = '200px';
          },
          hideCheckImg:function(){
               $('#checkImg')[0].style.height = '0px';
          },
          checkImg:function(e){
               var r = new FileReader();
               // this.headImageData = e.target.files[0];
               // console.log(this.headImageData);
               r.readAsDataURL(e.target.files[0]);
               var t = this;
               r.onload = function(e){
                    t.showCheckImg();
                    $('#checkImg')[0].src=this.result;
               };
          },
          hideHeadForm:function(){
               this.hideCheckImg();
               $('#peopleHeadForm')[0].style.display = 'none';
          },

          headImageUpdate:function(event){
               var formData = new FormData();
               formData.append('avator', $('#avatorInput')[0].files[0]);
               formData.append('uid',UID);

               var vm = this;               
               $.ajax({
                    type: 'post',
                    url: '/peopleImageUpdate',
                    data: formData,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function (headImagePath) {
                         vm.hideHeadForm();               
                         $('#headImg')[0].src = headImagePath;
                    }
               });
          },


          warnItem:function(item){
               item.css('border-color','red');
               setTimeout(function(){
                    item.css('border-color','transparent');
               },3000);
          },

          subBtnTextActive:function(text){
               this.subBtnText = text;
               var t = this;
               setTimeout(function(){
                    t.subBtnText = '更新';
               },3000);
          },

          textUpdate:function(){
               if(this.name.length>10){
                    this.warnItem($('#name'));
                    this.subBtnTextActive('昵称字数过长');
               }else if(this.introduce.length>60){
                    this.warnItem($('#introdushoe'));
                    this.subBtnTextActive('简介字数不能超过6０');
               }else{

                    var data = {
                         uid:UID,
                         name:this.name,
                         introduce:this.introduce,
                         sex:this.sex,
                         hobby:this.hobby,
                         birthday:this.birthday
                    };

                    textDataFilter(data);
                    var t = this;
                    $.post('/peopleTextUpdate',data,function(info){
                         t.name = info.name;
                         t.introduce = info.introduce;
                         t.sex = info.sex;
                         t.hobby = info.hobby;
                         t.birthday = info.birthday;
                         t.subBtnTextActive('更新成功');
                    });
               } 
          },


     }
});
const OtherPerson = {
	template:`
<div
	id='people'>

	<div class="title">
		个人信息
	</div>

	<button
		id='backToMainPage-btn'
		v-on:click='backToMainPage'
		class="btn btn-default"
	>返回主页
	</button>
	
	<div
		id='peopleHeadForm'
	>
		<h4>更新头像:</h4>
		<div>
			<input
				id='avatorInput'
				name="avator"
				type="file"
				class="btn btn-default"
				v-on:change='checkImg'
			>
			<button
				class="btn btn-success"
				v-on:click='headImageUpdate'
			>保存
			</button>
			<button
				class="btn btn-danger"
				v-on:click='hideHeadForm'
			>取消
			</button>
			<br clear='both'>
		</div>
		<img
			id='checkImg'
		/>
	</div>
		
	<div class="row">

		<div class="col-md-4">
			<img
				id='headImg'
				v-on:click='showPersonHeadForm'
				title="点击更新头像"
				v-bind:src= 'personHeadImage' 
			>
		</div>

		<div class="col-md-8">
			<div id='personInfo'>
				<div>
					<b>ID:</b>
					<span><%= uid %></span>
				</div>
				<div>
					<b>昵称:</b>
					<input
						v-model.trim='name'
					>
				</div>
				<div>
					<b>性别:</b>
					<input
						v-model.trim='sex'
					>
				</div>
				<div>
					<b>爱好:</b>
					<input
						v-model.trim='hobby'
					>
				</div>
				<div>
					<b>生日:</b>
					<input
						v-model.trim='birthday'
					>
				</div>
				<h4>叨叨:</h4>
				<textarea
					v-model.trim='introduce'
				><%= introduce %>
				</textarea>
				
				<div>
					<button
						style='margin-top:5px;'
						v-on:click='textUpdate'
						class="btn btn-primary"
					>{{subBtnText}}
					</button>
				</div>

			</div>
		</div>
	</div>
</div>

	<script>
		var name = '<%=name%>';
		var sex = '<%=sex%>';
		var PersonHeadImage = '<%=headImg%>';
		var introduce = '<%=introduce%>';
		var hobby = '<%=hobby%>';
		var birthday = '<%=birthday%>';
	</script>

	`,
} 

var Login = new Vue({

	template:`

<div id='login'>
    <div id='welcomeText'>SeaNet</div>
    <form
        v-on:keydown.enter = 'loginJudge'
        id='loginForm'
        class="bs-example bs-example-form"
        action="/"
        method="post"
    >

        <div class="title">
            登录
        </div>

        <div id="login-content">
            <div class="input-group">
                <span class="min-width-90 input-group-addon">
                    <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                    用户名
                </span>
                <input
                    class="form-control"
                    name="uid"
                    id="uid"
                    v-model.trim='uid'
                    placeholder="输入ID"
                >
            </div>
            <br>
            <div class="input-group">
                <span class="min-width-90 input-group-addon">
                    <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                    密码
                </span>
                <input
                    type="password"
                    class="form-control"
                    name="password"
                    id="password"
                    v-model.trim='password'
                    placeholder="输入密码"
                >
            </div>

            <div id='tip'><b>{{tip}}</b></div>

            <div id='chooseRL'>
                <input
                    id='loginSubmitBtn'
                    type="button"
                    class="btn btn-success"
                    v-on:click='loginJudge'
                    value="登录"
                >
                <input
                    id="toRegistBtn"
                    v-on:click='toRegist'
                    type="button"
                    class="btn btn-primary"
                    value="注册"
                >
            </div>
        </div>
    </form>
</div>


<script>
    var Tip = '<%= loginTip%>';
</script>

	`,

	data:function(){
        return {
    		uid:'',
    		password:'',
    		tip:false,
        }
	},
	methods:{
		toRegist:function(){
			window.location.href='/regist';
		},

		warnTip:function(text){
			this.tip = text;
			setTimeout(function(){
				this.tip = '';
			}.bind(this), 3000);
		},

		loginJudge:function(){

			if(this.uid === '' || this.password === ''){
				this.warnTip('账号和密码不能为空');
				return false;
			}

			var data = {
				uid: this.uid,
				password: this.password
			};

			$.get('/loginJudge', data, function(bool){

				if(bool){
					this.uid = data.uid;
					this.password = data.password;
					$('#loginForm')[0].submit();
					//将帐号记录在本地
					// localStorage.setItem('UID',this.uid);
					sessionStorage.setItem('UID',this.uid);

				}else{
					this.warnTip('账号或密码有误');
				}

			}.bind(this));
		}
	}
});
const Regist = {
	tempalte:`


<div
    id='regist'
>


    <div class="title">
        注册
    </div>

    <form
        v-on:keyup.enter="formSubmit"
        class="bs-example bs-example-form"
        role="form"
        id='registForm'
        action="/successRegist"
        method="post"
    >
        <div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                ID
            </span>
            <input
                v-on:focus='focusUid'
                v-on:blur='blurUid'
                type="text"
                class="form-control"
                name="uid"
                v-model.trim='uid'
                placeholder="输入ID"
            >
        </div>
        <div
            v-bind:style='styleTipUid'
        >{{tipUid}}
        </div>

        <div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                密码
            </span>
             <input
                v-on:focus="focusPw"
                v-on:blur='blurPw'
                type="password"
                class="form-control"
                name="password"
                id="password"
                v-model.trim='pw'
                placeholder="输入密码"
            >
        </div>
        <div
            v-bind:style='styleTipPw'
        >{{tipPw}}
        </div>

    	<div class="input-group">
            <span class="min-widch-100 input-group-addon">
                <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                确认密码
            </span>
            <input
                v-on:focus="focusPww"
                v-on:blur='blurPww'
                type="password"
                class="form-control"
                name="passwordCheck"
                id="passwordCheck"
                v-model.trim='pww'
                placeholder="确认密码"
            >
        </div>
        <div
            v-bind:style='styleTipPww'
        >{{tipPww}}
        </div>

    	<button
            v-on:click="formSubmit"
            type="button"
            class="btn btn-success"
        >{{submitText}}
        </button>
    	
        <button 
            v-on:click='backToLogin'
            type="button"
            class="btn btn-default"
        >返回
        </button>
    </form>
	`,
	data:{
		regUid:/^\w{6,16}$/,
		regPw:/^.{6,14}$/,

		uid:'',
		pw:'',
		pww:'',
		
		tipUid:'',
		tipPw:'',
		tipPww:'',
	
		styleTipUid:{
			height:'30px',
			color:'green'
		},
		styleTipPw:{
			height:'30px',
			color:'green'
		},
		styleTipPww:{
			height:'30px',
			color:'green'
		},

		submitText:'提交',




        registStyle:{
            border:'1px solid #00A2AF',
            'border-bottom-width':'10px',
            'box-shadow':' 0 0 5px #999',
            'margin-top':'10%',
            width:'320px',
            padding:'0',
            'border-radius':' 2px',
        },
        titleStyle:{
            'background-color':'#00A2AF',
            color:'#FFF',
            height:'40px',
            'line-height':' 40px',
            'font-weight':'600',
            'font-size':'16px',
            'text-align': 'center',
            'border-top-left-radius':' 2px',
            'border-top-right-radius':' 2px',
        },
        registFormStyle:{
            margin:'20px auto',
            width:'300px',
        },
        // @media (max-width: 500px){
        //     .container{
        //         padding:'5px',
        //     }
        //     #registForm{
        //         padding:'10px',
        //     }
        // }
        registFormInputStyle:{
            height:'40px',
        },
        redBorder:{
            border:'1px solid red',
        },
        btn:{
            margin:'0 2%',
            width:'45%',
        },
        'min-widch-100':{
            'min-width':'100px',
        },
	},
	computed:{
		flagUid:function(){
			return this.regUid.test(this.uid);
		},
		flagPw:function(){
			return this.regPw.test(this.pw);
		},
		flagPww:function(){
			return isSame(this.pw,this.pww);
		}
	},
	methods:{
		backToLogin:function(){
			window.location.href='/';
		},

		focusUid:function(){
			this.tipUid = '字母和数字皆可,长度为6-16';
		},
		blurUid:function(){
			if(!this.flagUid){
				this.styleTipUid.color = 'red';
				this.tipUid = '账号有误';
				return false;
			}

			var t = this;
			$.get('/checkUidIsUsed',{uid: this.uid},function(bool){
				if(bool){
					t.tipUid = '账号已被使用';
					t.styleTipUid.color = 'red';
				}else{
					t.tipUid = '账号可用';
					t.styleTipUid.color = 'green';
				}
			});
		},
	

		focusPw:function(){
			this.tipPw = '请输入密码';
		},
		blurPw:function(){
			this.styleTipPw.color = 'green';
			
			if(this.pw === ''){
				this.tipPw = '密码不能为空';
				this.styleTipPw.color = 'red';
				return false;
			}else if(!this.flagPw){
				this.tipPw = '密码长度不对';
				this.styleTipPw.color = 'red';
			}else{
				this.tipPw = '密码可行';
				this.styleTipPw.color = 'green';
			}
		},

		focusPww:function(){
			this.tipPww = '重复确认密码';
		},
		blurPww:function(){
			if(this.pww === ''){
				this.tipPww = '密码不能为空';
				this.styleTipPww.color = 'red';
			}else if(!this.flagPww){
				this.tipPww = '两次密码不一样';
				this.styleTipPww.color = 'red';
			}else{
				this.tipPww = '确认完成';
				this.styleTipPww.color = 'green';
			}
		},

		formSubmit:function(){
			if(this.flagUid && this.flagPw && this.flagPww){
				$('#registForm').submit();
			}else{
				this.submitText = '请检查每个输入项';
				setTimeout(function(){
					regist.submitText = '提交';
				}, 2000);
			}
		},
	}
}
const Domore = {
  template:
    `<div id='domore'>
      <div
        id='logOff'
        v-on:click='logOff'
      >注销</div>

      <div 
        id='person'
        v-on:click='getPersonInfo'
        class='ele'
        data-toggle='tooltip'
        data-placement='left'
        title='个人信息'
      >
        <span class='glyphicon glyphicon-user' aria-hidden='true'></span>
      </div>
      <div
        id='myteam'
        v-on:click='getTeamsInfo'
        class='ele'
        data-toggle='tooltip'
        data-placement='top'
        title='团队'
      >
        <span class='glyphicon glyphicon-fire' aria-hidden='true'></span>
      </div>
      <div
        id='buildTeam'
        v-on:click='toBuildATeam'
        class='ele'
        data-toggle='tooltip'
        data-placement='bottom'
        title='创建团队'
      >
        <span class='glyphicon glyphicon-grain' aria-hidden='true'></span>
      </div>
    </div>`,
  data:function(){
    return {
    };
  },
  methods:{
    logOff:function(){
      main.isWantToLogOff = true; 
    },
    getPersonInfo:function(){
      zPost('/people',UserEnsure);
    },
    getTeamsInfo:function(){
      zPost('/myteam',UserEnsure);
    },
    toBuildATeam:function(){
      zPost('/DealWithTeam',UserEnsure);
    },
  }
};
var Logoff = {
	template:`
	  <div
	    class='logOffJudgeHide'
	    v-bind:class='{logOffJudgeShow:isWantToLogOff}'
	  >
	    <div class='title'>
	      确认注销吗？
	    </div>

	    <div
	      id='ensureLogOff-btn'
	      v-on:click = 'ensureLogOff'
	    >确认
	    </div>
	    
	    <div
	      id='cancelLogOff-btn'
	      v-on:click = 'cancelLogOff'
	    >取消
	    </div>
	  </div>
	`,
}

const MessageFrame = {

  template:`
<div
  v-show='messageframeSeen'
  class='messageframe'
>
  <div class='messageframe-top'>
    <div
      class='messageframe-close'
      v-on:click='messageframeClose'
    >
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    </div>
    
    <div>[{{messtype}}]{{nameOfmessageframe}}</div>
    
    <div
      class='messageframe-info'
      v-on:click='getMoreInfo'
    >
      <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
    </div>
  </div>

  <div
    class="getMoreMessageOnFrame-btn"
    v-on:click='getMoreMessage'
  >Get More Message
  </div>

    <div
      id='messageframe-cont'
      class='messageframe-cont'
      v-on:scroll='messageContentOnScroll'
    ></div>

    <div
      v-show='expressionSeen'
      class='messageframe-expression'>
    </div> 

    <div class='messageframe-say'>
      <button
        class='messageframe-face'
        v-on:click='showExpressions'
      >
        <span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span> 
      </button>

      <input
        id='messageframe-input'
        v-on:keyup.enter='sendMessage'
      >

      <button
        v-on:click='sendMessage'
        class='messageframe-subm'
      >
        <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      </button>
    </div>

  <div
    v-show='moreinfoSeen'
    class='moreinfo'
  >
    <div
      v-show='teamMembersSeen'
      class='teamMembers'
    >
      <div v-on:click='closeTeamMembers'>
        <span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
      <ul></ul>
    </div>
    
    <div style='float:left;'>
      <div
        class='moreinfo-close'
        v-on:click='closeMoreinfo'
      >
        <span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
      
      <img v-bind:src="moreInfo.headImg" />
      
      <hr style='border-color: #C0D0D0;border-width: 2px;'>
      <div class="info">
        <div>
          <h3>UID&nbsp: </h3>
          <h4>{{moreInfo.uid}}</h4>
        </div>
        <div>
          <h3>名称&nbsp: </h3>
          <h4>{{moreInfo.name}}</h4>
        </div>
        <div v-show='isTeam'>
          <h3>等级&nbsp: </h3>
          <h4>{{moreInfo.level}}</h4>
        </div>
        <div v-show='isTeam'>
          <h3>人数&nbsp: </h3>
          <h4>{{moreInfoTeamMemberNumber}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>性别&nbsp: </h3>
          <h4>{{moreInfo.sex}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>爱好&nbsp: </h3>
          <h4>{{moreInfo.hobby}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>生日&nbsp: </h3>
          <h4>{{moreInfo.birthday}}</h4>
        </div>
        <div>
          <h3>介绍&nbsp: </h3>
          <h4>{{moreInfo.introduce}}</h4>
        </div>
      </div>
      <hr style=' float:left; width:100%;border-color: #C0D0D0;border-width: 1px;'>
      <div class="more">
        <button 
          v-show='!isTeam'
          v-on:click='starOrUnstar'
          class="btn btn-success"
          aria-haspopup="true"
          aria-expanded="false"
        >Star/Unstar
        </button>
        <button
          v-show='!isTeam'
          v-on:click='deleteTheRecentChat'
          class="btn btn-warning"
          aria-haspopup="true"
          aria-expanded="false"
        >Delete Chat
        </button>
        <button
          v-show='isTeam'
          v-on:click='exitTeam'
          class="btn btn-danger"
          aria-haspopup="true"
          aria-expanded="false"
        >Exit Team
        </button>
        <button
          v-show='isTeam'
          v-on:click='showMembers'
          class="btn btn-primary"
          aria-haspopup="true"
          aria-expanded="false"
        >Show Members
        </button>
      </div>
    </div>
  </div>
</div>
  `,

};
var MessList = {
  props:{
    type:{
      type:String,
      require:true
    },
    info:{
      type: Array,
      require: true,
      validator: function(value){
        return value !== null;
      }
    }
  },
  template:
    `<ul
      v-bind:id='type'
    >
      <li
        v-for='i in info'
        :key='i.uid'
        v-on:click='openMessage($event,i.uid,i.level,i.name,i.unread)'
        v-bind:style='liHeight(i.level)'
      >
        <div class='info'>
          <div class='name'>
            {{i.name}} 
            <span class="badge" v-show='showBadge(i.unread)'>{{i.unread}}</span>
          </div>

          <div class='li_type'>
            <span v-if=i.level>team</span>
            <span v-else>people</span>
          </div>

          <span class='uid' >{{i.uid}}</span>
          <div class='introduce'>{{i.introduce}}</div>
        </div>

        <div
          class='avator'
          v-bind:style='avatorStyle(i.level)'
        >
          <img v-bind:src=i.headImg>
        </div>
      </li>
    </ul>`,
  data:function(){
    return {

    };
  },
  computed:{

  },
  methods:{
    showBadge:function(badgeNumber){
      return Boolean(badgeNumber);
    },
    liHeight:function(havelevel){
      var h = this.type==='recent'?
              havelevel?'80':'50':
              this.type==='star'?'60':'100';
      return {
        height:h+'px',
        overflow:'hidden'
      };
    },
    avatorStyle:function(havelevel){
      var w,b_radius;
      switch(this.type){
        case('recent'):{
          w = havelevel?'78':'50';
          b_radius = havelevel?'0':'50';
          break;
        }
        case('star'):{
          w='60';
          b_radius='50';
          break;
        }
        case('team'):{
          w='90';
          b_radius='0';
          break;
        }
      }        
      return { 
        width:w+'px',
        borderRadius:b_radius+'%'
      };
    },

    subUnreadInDB:function(li_uid,haslevel){
      var data = {
        type: haslevel?'team':'people',
        uid: UID,
        to: li_uid,
        checked: true
      };
      $.post('/unReadTo0',data);
    },


    //  当某个messli被点击时，触发该方法
    //  event:触发的事件
    //  liUid:触发事件的对象所需要的对应聊天ID
    //  hasLevel:只有团队才有等级,判断是否是一个团队对象
    //  receiverName:对应接收者的名称，用于聊天框顶部标明在和谁聊天
    //  unread:未读数量,根据未读数量截取聊天记录中的对应消息
    openMessage:function(event, liUid, hasLevel, receiverName, unread){
      main.moreinfoSeen = false;
      // this.$emit('dealU', liUid, hasLevel);

      console.log(arguments);

      main.dealUnread(liUid,hasLevel);
      this.subUnreadInDB(liUid, hasLevel);

      main.messtype = hasLevel?'team':this.type;

      main.messageframeSeen = true;

      $('.messageframe')[0].style.height = '100%';
      $('#messageframe-cont')[0].innerHTML = '';

      main.nameOfmessageframe = receiverName;

      main.messto = liUid;

      console.log(typeof unread);
      console.log('unread:'+unread);
      if(unread){
        this.getUnreadMess(main.messto, unread, main.messtype);
      }
    },

    getUnreadMess:function(getUid,unread,type){
      var data = {
        uid:UID,
        getUid:getUid,
        unread:unread,
        type:type
      };

      console.log('Data of get unread Messages:');
      console.log(data);

      $.get('/getUnreadMess', data, function(d){
        console.log(d);
        for(i=0;i<d.length;i++){
          main.createMessDiv(d[i], false);
        }
      });
    },
  },
};
var Search = {
  template:
    `<div id='search-content' >
      <div id='search' v-on:keyup.enter='getSearchResponse'>
      <button
        id='search-sub'
        v-on:click='getSearchResponse'
      >
        <span class='glyphicon glyphicon-search' aria-hidden='true'></span>
      </button>
      <input
        v-model.trim='searchId'
        id='search-uid'
        name='search_uid'
        placeholder='请输入团队或用户的ID'
      >
      <div
        id='search-close'
        v-on:click='closeCheckInfo'
      >
        <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
      </div>
    </div>
    <div id='search-info'>
      <div id='search-person-info'></div>
      <div id='search-team-info'></div>
    </div>
  </div>`,
  data:function(){
    return {
      searchId:''
    };
  },
  methods:{

    closeCheckInfo:function(){
      this.searchId = '';

      $('#search-uid')[0].style.width = '78%';
      $('#search-close')[0].style.transform = 'translateX(-100%)';
      $('#search-info')[0].style.display = 'none';
    },
    
    getSearchResponse:function(){
      $('#search-team-info').html('');
      $('#search-person-info').html('');
      
      if(this.searchId === ''){
        return false;
      }

      if(this.searchId === UID){
        $('#search-person-info').html(
          "<div class='alert alert-info' role='alert'>无法查询你自己</div>"
          );
        return false;
      }

      $('#search-uid')[0].style.width='70%';
      $('#search-close')[0].style.transform = 'translateX(0)';
      $('#search-info')[0].style.display = 'block';

      var t = this;
      $.get("/search",{uid:this.searchId },function(d){
        var team = d.team;
        var person = d.person;
        t.createSearchTeamInfo(team);
        t.setSearchTeamStatus(team);
        t.createSearchPersonInfo(person);
        t.setSearchPersonStatus(person);
      });

    },
    
    createSearchPersonInfo:function(person){
      $('#search-person-info').html(vCreateSearchPersonInfoTemplate(person));
    },

    createSearchTeamInfo:function(team){
      $('#search-team-info').html(vCreateSearchTeamInfoTemplate(team));
    },

    setSearchTeamStatus:function(team){
      if(!team){
        return false;
      }

      var t = this;
      $('#join').click(function(){
        var data = {
          uid:UID,
          tid:t.searchId
        };
        $.get('/joinJudge',data,function(judge){
          if(judge==='ok'){ 
            zPost('/join',data); 
          }else{
            $('#search-team-info').append(
              "<div class='alert alert-info'>"+judge+"</div>"
            );
          }
        });
      });
    },

    setSearchPersonStatus:function(person){
      if(!person){ return false; }

      var t = this;
      $('#send').click(function(){

        main.messageframeSeen = true;
        document.querySelector('.messageframe').style.height='100%';
        main.messtype = 'recent';
        main.messto = t.searchId;
        main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();

      });

      $('#search-star-info').click(function(){
        var stars = loginlist.star;
        var isStar = false;
        var data = { 
          sid:t.searchId,
          uid:uid
        };
        
        if(stars.length){
          for(var i=0;i<stars.length;i++){
            if(stars[i]===data.sid){
              isStar = true;
              break;
            }
          }
        }
        if(isStar){
          $('#search-person-info').prepend(
            "<div class='alert alert-info' role='alert'>已经标记过！</div>"
          );
        }else{
          $.post('/star',data,function(data_back){
            v_addThePeopleInStar(data_back);
            loginlist.star.push(data.sid);
            $('#search-person-info').prepend(
              "<div class='alert alert-success' role='alert'>成功标记该用户!</div>"
            );
          });
        }
      });
    }
  }
};
var UserInfo = {
  props:{
    info:Object
  },
  template:
    `<div
      class='user-wrap'
    >
      <img
        id='user-avator'
        v-bind:src='info.headImg'
      >
    
      <div
        id='user-intro'
        v-bind:class='{userinfo_intro:true}'
      >
        <div id='user-nickname'>{{info.name}}</div>
        
        <div
          id='user-introduce'
        >{{info.introduce}}
        </div>
      </div>

      <div
        id='user-set'
        v-on:click='toggleDomore'
      >
        <span class='glyphicon glyphicon-list' aria-hidden='true'></span>
      </div>
    
    </div>`,
  data:function(){
    return {
    };
  },
  methods:{
    toggleDomore:function(){
      $('#domore')[0].style.width = (main.isDomore?'0':'70')+'px'; 
      main.isDomore = !main.isDomore;
    },
  }
};
const SuccessRegist = {
	template:`
    
<div class="container">
  	<h2>恭喜,注册成功!</h2>
    <button
      id='login-btn'
      type="button"
      class="btn btn-success"
      >直接登录
    </button>

    <a href="/">
      <button
        type="button"
        class="btn btn-default"
        >返回
      </button>
    </a>

  var UID = '<%= uid%>';
  var Password = '<%= password%>';
  document.getElementById('login-btn').onclick = function(){
    zPost('/main',{
      uid:UID,
      password:Password
    });
    sessionStorage.setItem('UID',UID);
  };


</div>
	color:#444;
      padding-top:50px;
      text-align: center;
      margin:15% auto;
      border-top:solid 5px #00A2AF;
      border-bottom:solid 5px #00A2AF;
      display: block;
      width: 80%;
      height:250px;
	`,


}


      




const BuildTeam = {
	template: `
        <form
            class="bs-example bs-example-form"
            id="teamForm"
            action="/successBuildTeam"
            role='form' 
            method='post'
        >
            <div id='welcome'>创建团队</div>

            <div class="input-group">
                <span
                    class="input-group-addon"
                    style='width:80px;'
                >名称
                </span>
                <input
                    name='teamname'
                    v-on:focus='focusTeamname'
                    v-on:blur='blurTeamname'
                    v-model.trim='teamname'
                    class="form-control"
                >
            </div>

            <div 
                class='tip'
                id='tipTeamname'
            >{{tipTeamname}}
            </div>

            <br>

            <div class="input-group">
                <span
                    class="input-group-addon"
                    style='width:80px;'
                >口令
                </span>
                <input
                    id='password'
                    name='password'
                    v-on:focus='focusPassword'
                    v-on:blur='blurPassword'
                    v-model.trim = 'password'
                    type='password'
                    class="form-control"
                >
            </div>

            <div
                class='tip'
                id='tipPassword'
            >{{tipPassword}}
            </div>

            <br>
              <div class="input-group">
                <span
                    class="input-group-addon"
                    style='width:80px;'
                >重复口令
                </span>
                <input
                    id='password1'
                    v-model.trim = 'password1'
                    v-on:focus= 'focusPassword1'
                    v-on:blur='blurPassword1'
                    type="password"
                    class="form-control"
                >
                </div>

        		<div 
                    class='tip'
                    id='tipPassword1'
                >{{tipPassword1}}
                </div>

            <br>

            <button
                v-on:click="formSubmit"
                id="submitBtn"
                type="button"
                class="btn btn-primary"
            >建立
            </button>

            <button
                id="backBtn"
                v-on:click="backToMainPage"
                type="button"
                class="btn btn-warning"
            >取消
            </button>

            <br clear='both'>
        </form>`,

    data:function(){
        return {
            regTeamname:/^.{2,10}$/,
            regPassword:/^.{3,8}$/,

            teamname:'',
            password:'',
            password1:'',

            tipTeamname:'',
            tipPassword:'',
            tipPassword1:'',

            flagTeamname:false,
            flagPassword:false,
            flagPassword1:false,







            welcomeStyle:{
                'font-size':'24px',
                'color':'#556',
                'text-align':'center',
                'margin':'10px',
            },
            teamFormStyle:{
                'margin':'0 auto',
                'border':'2px solid #0A74D0',
                'border-top':'25px solid #0A74D0',
                'border-bottom':'10px solid #0A74D0',
                'border-left':'2px solid #0A74D0',
                'border-right':'2px solid #0A74D0',
                'box-shadow': '0 0 10px #999',
                'width':'300px',
                'padding':'20px',
            },
            submitBtnStyle:{
                width:'60%',
                height:'40px',
                float:'left',
            },
            backBtnStyle:{
                float:'right',
                width:'30%',
                height:'40px',
            },
            tipStyle:{
                height:'15px'
            }
        }
    },
    methods:{

        tipOk:function(obj){
            obj.style.color = 'green';
        },
        tipAlert:function(obj){
            obj.style.color = 'red';
        },

        focusTeamname:function(){
            this.tipOk($('#tipTeamname')[0]);
            this.tipTeamname = '团队名称长度限制在2-10之间';
        },
        focusPassword:function(){
            this.tipOk($('#tipPassword')[0]);
            this.tipPassword = '口令长度限制在3-8之间';
        },
        focusPassword1:function(){
            this.tipOk($('#tipPassword1')[0]);
            this.tipPassword1 = '确认团队口令';
        },

        blurTeamname:function(){
            if(this.regTeamname.test(this.teamname)){
                this.tipTeamname = '团队名称可行';
                this.flagTeamname = true;
            }else{
                this.tipAlert($('#tipTeamname')[0]);
                this.tipTeamname = '团队名称有误';
                this.flagTeamname = false;
            }
        },
        blurPassword:function(){
            if(this.regPassword.test(this.password)){
                this.tipPassword = '密码可行';
                this.flagPassword = true;
            }else{
                this.tipAlert($('#tipPassword')[0]);
                this.tipPassword = '密码有误';
                this.flagPassword = false;
            }
        },
        blurPassword1:function(){
            if(isSame(this.password,this.password1)){
                this.tipPassword1 = '密码确认完成';
                this.flagPassword1 = true;
            }else{
                this.tipAlert($('#tipPassword1')[0]);
                this.tipPassword1 = '两次密码不一样';
                this.flagPassword1 = false;
            }
        },

        backToMainPage:function(){ 
            zPost('/main',UserEnsure);
        },

        formSubmit:function(){

            if(!(this.flagTeamname && this.flagPassword && this.flagPassword1)){
                return false;
            }
            formAddInput($('#teamForm')[0],'uid',UID);
            $('#teamForm')[0].submit();
        }   
    },
}
var DismissTeam = {

	template:`

	<div class="container" id='dismissTeam'>
		<div class="title">
			解散团队
		</div>
		<form
			id='dismissForm'
			action="/successDismissTeam"
			method="post"
		>
			<div class="form-group">
			    <input
			    	class="form-control"
					v-model.trim='teamId'
					v-on:focus='focusTeamId'
					v-on:blur='blurTeamId'
					name="teamId"
					placeholder='输入团队ID'
				>
	    		<label
	    			for="teamId"
					v-bind:style='styleTipTeamId'
	    		>{{tipTeamId}}
	    		</label>
			 </div>

			<div class="form-group">
				<input 
					type="password" 
					class="form-control"
					v-on:focus='focusTeamPassword'
					v-on:blur='blurTeamPassword'
					v-model.trim='teamPassword'
					name="teamPassword"
					placeholder='输入团队口令'
				>
				<label
					for="teamPassword"
					v-bind:style='styleTipTeamPassword'
				>{{tipTeamPassword}}
				</label>
			</div>
	  	
		  	<button
		  		id='formSubmit-btn'
				v-on:click='formSubmit'
				class="btn btn-danger"
				type="button"
			>确认解散
			</button>
			
			<button
				id='backToMainPage-btn'
				type='button'
				class="btn btn-default"
				v-on:click='backToMainPage'
			>返回主页
			</button>
			<br clear='both'>
		</form>
	</div>
<script type="text/javascript">
	var TeamPassword = '<%=team_password%>';
	console.log(TeamPassword);
</script>
	`,

	data:function(){
		return{
			teamId:'',
			teamPassword:'',

			tipTeamId:'',
			tipTeamPassword:'',

			styleTipTeamId:{
				height:'15px',
				color:'green'
			},
			styleTipTeamPassword:{
				height:'15px',
				color:'green'
			},



			dismissTeamStyle:{
				'margin-top':'10%',
				width:'300px',
		        border:'1px solid #B71210',
		        'box-shadow': '0 0 2px #55FFD6',
		        padding:0,
			},
			titleStyle:{
			    'background-color':'#BB1111',
				color:'#FFF',
			    'margin-bottom':'20px',
			    'height':'30px',
			    'line-height': '30px',
			    'font-weight':600,
			    'font-size':'16px',
			    'text-align': 'center',
			},

			dismissFormStyle:{
				margin:'20px'
			},

			formSubmitBtnStyle:{
				width:'60%',
				float:'left',
			},
			backToMainPageBtnStyle:{
				width:'30%',
				float:'right',
			}
		}
	},

	computed:{
		flagTeamId:function(){
			return isSame(this.teamId,UID);
		},
		flagTeamPassword:function(){
			return isSame(this.teamPassword,TeamPassword);
		}
	},

	methods:{

		focusTeamId:function(){
			this.tipTeamId = '请输入团队ID';
		},
		blurTeamId:function(){
			if(this.flagTeamId){
				this.tipTeamId = 'ID正确';
				this.styleTipTeamId.color = 'green';
			}else{
				this.tipTeamId = 'ID不正确';
				this.styleTipTeamId.color = 'red';
			}
		},

		focusTeamPassword:function(){
			this.teamPassword = '请输入团队口令'; 
		},
		blurTeamPassword:function(){
			if(this.flagTeamPassword){
				this.tipTeamPassword = '口令正确';
				this.styleTipTeamPassword.color = 'green';
			}else{
				this.tipTeamPassword = '口令不正确';
				this.styleTipTeamPassword.color = 'red';
			}
		},


		formSubmit:function(){

			if(this.flagTeamId && this.flagTeamPassword){
				document.getElementById('dismissForm').submit();
				return true;
			}

			if(!this.flagTeamId){
				this.tipTeamId = 'ID不正确';
			}

			if(!this.flagTeamPassword){
				this.tipTeamPassword = '口令不正确';
			}
		},
		backToMainPage:function(){
			zPost('/main',UserEnsure);
		}
	}
}
var JoinTeam = {
	template:`
		<div
			v-bind:style="containerStyle"
		>
			<h4>请输入团队口令：</h4>
			<p id='tip'></p>
			<input id='pw' />
			<button
				v-on:click='ok'
				style='box-shadow: 0 0 2px #305598;'
				class='btn btn-primary'
			>确认</button>
			<button
				v-on:click='back'
				style='box-shadow: 0 0 2px #BD931C;'
				class='btn btn-warning'
			>返回主页</button>

		</div>

		<script>
			var tid = '<%= tid%>';
		</script>
	`,
	data:{

		containerStyle:{
			border:'solid 2px #008D8E',
			'border-radius': '0.5em',
			width:'370px',
			display: 'block',
			margin:'20% auto',
			padding:'1em',
			'box-shadow': '0 0 2px #596F8C',
		},
		tipStyle:{
			color:'red',
		}

	},

	methods:{
		back:function(){ 
			zPost('/main',UserEnsure);
		},
		ok:function(){
			var okEnsure = {
				password:document.getElementById('pw').value.trim(),
				uid:UID,
				tid:tid
			};
			$.post('/join_ok',okEnsure,function(judge){
				if(judge){ 
					join.back();
				}else{
					document.getElementById('tip').innerText='口令不对!';
				}
			});
		}
	}
}
var myteam = {
  template:`
    <div
      class="container"
      id='myteam'
    >
      <div class='panel panel-default'>
        <div class='panel-heading'>
            <div>
              <button
                    id='backToMainPage-btn'
                    v-on:cli00ck = 'backToMainPage'
                    class='btn btn-default'
                >返回主页
                </button>

                <button
                    v-if='buildTeam'
                    id='updateMyteam-btn'
                    v-on:click='updateMyteam'
                    class='btn btn-primary'
                >进入我的团队界面
                </button>

            </div>
            <h3>你所创建的团队</h3>
        </div>

        <div class='panel-body'>
            <h4 v-if='!buildTeam'>你还没有建立自己的团队</h4>
            <div v-else>
                <img 
                    class='avator' 
                    v-bind:src='buildTeam.headImg'
                />
                <div class='info'>
                    <div class='teamname'>
                        团队名称: {{buildTeam.name}}
                    </div>
                    <div class='level'>
                        等级: {{buildTeam.level}}
                    </div>
                    <div class='membernumber'>
                        成员数量: {{buildTeam.membernumber}}
                    </div>
                    <div class='introduce'>
                        <h4>队长豪言：</h4>
                        {{buildTeam.introduce}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class='panel panel-default'>
        <div class='panel-heading'>
            <h3>你所加入的团队</h3>
        </div>

        <div class='panel-body'>
            <h4 v-if='!joinTeams.length'>没有团队记录</h4>
            <div v-else >
                <div v-for='i in joinTeams'>
                    <div class='avator'>
                        <img v-bind:src='i.headImg' />
                    </div>
                
                    <div class='info'>
                        <div class='id'>ID: {{i.uid}}</div>
                        <div class='teamname'>团队名称: {{i.name}}</div>
                        <div class='level'>等级: {{i.level}}</div>
                        <div class='membernumber'>成员数量: {{i.membernumber}}</div>
                        <div class='introduce'>
                            <h4>队长豪言：</h4>
                            {{i.introduce}}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

    </div>
    <script type="text/javascript">
      var teaminfos = JSON.parse(jsonKeep('<%=teaminfos%>'));
    </script>
  `,
  data:{
    teaminfos:false
  },
  computed:{
    buildTeam:function(){
      var t = this.teaminfos;

      for(var i=0;i<t.length;i++){
        if(t[i].uid === UID){
          return t[i];
        }
      }
      return false;
    },
    joinTeams:function(){
      var j=[];
      var t = this.teaminfos;
      for(var i=0;i<t.length;i++){
        if(t[i].uid !== UID){
          j.push(t[i]);
        }
      }
      return j;
    }
  },
  methods:{
    backToMainPage:function(){
      zPost('/main',UserEnsure);
    },
    updateMyteam:function(){
      window.location.href='/teams?uid='+UID;
    }
  }
};
var teams = {

    template:`
<div id='teams'>

    <div class="title">
        团队信息
    </div>

    <button
        id='backToMainPage-btn'
        v-on:click='backToMainPage'
        class="btn btn-default"
    >返回主页
    </button>

    <div
        id='teamHeadForm'
    >
        <h4>更新头像:</h4>
        <div>
            <input
                id='avatorInput'
                name="avator"
                type="file"
                class="btn btn-default"
                v-on:change='checkImg'
            >
            <button
                type='button'
                class="btn btn-success"
                v-on:click='headImageUpdate'
            >保存
            </button>
            <button
                type='button'
                class="btn btn-danger"
                v-on:click='hideHeadForm'
            >取消
            </button>
            <br clear='both'>
        </div>
        <img
            id='checkImg'
        />

    </div>

    <div class="row">

        <div class="col-md-4">
            <img
                id='headImg'
                v-on:click='showTeamHeadForm'
                title="点击更新头像"
                v-bind:src= 'teamHeadImage'
            >
        </div>

        <div class="col-md-8">
            <div id="teamInfo">
                <div>
                    <b>ID:</b>
                    <span>{{teamUid}}</span>
                </div>
                <div>
                    <b>团队名称:</b>


                    <input v-if='isMyTeam' 
                        v-model.trim='teamname'
                    >
                    <span v-else>{{teamname}}</span>
                </div>
                <div>
                    <b>等级:</b>
                    <span>{{teamLevel}}</span>
                    
                </div>
                <div>
                    <b>人数:</b>
                    <span>{{teamMemberNumber}}</span>
                    
                </div>
                <h4>队长留言:</h4>
                <textarea
                    v-if='isMyTeam'
                    v-model.trim='teamIntroduce'
                >{{teamIntroduce}}
                </textarea>
                
                <div
                    v-else
                    class="textarea"
                >{{teamIntroduce}}
                </div>

                <div>
                    <button
                        style='margin-top:5px;'
                        v-on:click='textUpdate'
                        class="btn btn-primary"
                    >{{subBtnText}}
                    </button>
                </div>

            </div>
        </div>
    </div>

</div>

<%include frameuse.ejs%>
<script type="text/javascript">
    
var TeamUid = '<%= uid%>';
var Teamname = '<%= name%>';
var TeamPassword = '<%=password%>';
var TeamLevel = '<%=level%>';
var TeamIntroduce = '<%=introduce%>';

// var TeamMembers = JSON.parse(jsonKeep('<%=member%>'));
var TeamMembers = '<%=member%>';

var TeamHeadImage = '<%=headImg%>';



console.log(TeamUid);
console.log(Teamname);
console.log(TeamPassword);
console.log(TeamLevel);
console.log(TeamIntroduce);
console.log(TeamMembers);
console.log(TeamHeadImage);


</script>
<script src='js/teams.js'></script>


    `,

    data:{
        teamUid:false,
        teamname:false,
        teamPassword:false,
        teamLevel:false,
        teamIntroduce:false,
        teamMembers:false,
        teamHeadImage:false,

        subBtnText:'更新',

        styleTeamIntroduce:{
            border:'1px solid #AAA',
        },
    },
    computed:{
        teamMemberNumber:function(){
            return this.teamMembers.length;
        },
        isMyTeam:function(){
            return this.teamUid === UID;
        }
    },
    methods:{
        backToMainPage:function(){
            zPost('/main',UserEnsure);
        },
        showTeamHeadForm:function(){
            if(this.isMyTeam){
                $('#teamHeadForm').css('display','block');
            }
        },
        showCheckImg:function(){
            $('#checkImg')[0].style.height = '200px';
        },
        hideCheckImg:function(){
            $('#checkImg')[0].style.height = '0px';
        },
        checkImg:function(e){
            var r = new FileReader();
            // this.headImageData = e.target.files[0];
            // console.log(this.headImageData);
            r.readAsDataURL(e.target.files[0]);
            var t = this;
            r.onload = function(e){
                t.showCheckImg();
                $('#checkImg')[0].src=this.result;
            };
        },
        showTeamHeadform:function(){
          $('#teamHeadForm').css('display','block');
        },

        hideHeadForm:function(){
           this.hideCheckImg();
           $('#teamHeadForm')[0].style.display = 'none';
        },

        headImageUpdate:function(event){
            var formData = new FormData();
            formData.append('avator', $('#avatorInput')[0].files[0]);
            formData.append('uid',UID);

            var vm = this;               
            $.ajax({
                type: 'post',
                url: '/teamsImageUpdate',
                data: formData,
                // mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success:function (headImagePath) {
                    vm.hideHeadForm();               
                    $('#headImg')[0].src = headImagePath;
                }
            });
        },

        showImg:function(e){
          var that = e.target;
          var img = that.nextElementSibling;
          var r = new FileReader();
          r.readAsDataURL(that.files[0]);
          r.onload = function(){
            img.src=this.result;
          };
        },

        subBtnActive:function(text){
            this.subBtnText = text;
            var vm = this;
            setTimeout(function(){
                vm.subBtnText = '更新';
            },3000);
        },

        textUpdate:function(){
          if(this.teamIntroduce.length>80){

            this.subBtnActive('简介字数不能超过８０');

            return false;
          }else{
            var data = {
              uid:UID,
              name:this.teamname,
              introduce:this.teamIntroduce
            };
            textDataFilter(data);
            var vm = this;
            $.post('/teamsTextUpdate',data,function(d){

                this.teamname = data.name;
                this.teamIntroduce = data.introduce;
                vm.subBtnActive('修改成功');

            });
          }
        }
    }
}
const ShouldDismissTeam = {
	template:`
		<h4 style='color:#333;'>你已经建立了一个团队，需要先解散原团队.</h4>
			<button id='dismiss' class="btn btn-warning">解散原团队</button>
			<button id='back' class="btn btn-default">返回</button>
	
	<script>
		document.getElementById('dismiss').onclick = function(){
			window.location.href='/dismissTeam?uid='+UID;
		}

		document.getElementById('back').onclick = function(){ 
			zPost('/main',UserEnsure);
		}
	</script>

	`,
	data:function(){
		return {
			style1:{
				'padding-top':'50px',
				'text-align': 'center',
				'margin':'15% auto',
				'border-top':'solid 5px #AA2233',
				'border-bottom':'solid 5px #AA2233',
				'display': 'block',
				'width': '80%',
				'height':'200px',
				'box-shadow': '5px 5px 10px #999',
			}
		}
	
	}
}





const SuccessBuildTeam = {
	template:`
		.container{
			padding-top:50px;
			text-align: center;
			margin:15% auto;
			border-top:solid 5px #44CCAA;
			border-bottom:solid 5px #44CCAA;
			display: block;
			width: 80%;
			height:200px;
		}
		<h4 style='color:#333;'>
			成功建立团队!
			<br>
			把口令告诉你的朋友,方便他们加入哦!
		</h4>
		<button id='back' class='btn btn-default'>知道了</button>
	</div>


	<script>
		$('#back')[0].onclick = function(){
			zPost('/main',UserEnsure);
		}
	</script>	
	`,
}



const SuccessDismissTeam = {
	template:`
const Success


<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<title>Seanet-Dismissteam successfully</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<!-- <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"> -->
	<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<style>
	    @media (max-width: 970px) {
	        body{
	            background-size:1000px 100%;
	        }
	    }
		#container{
			border:solid 2px #8619cc;
			border-radius: 0.5em;
			margin:10% auto;
			width:400px;
			height:240px;
			display: block;
		}
	</style>
</head>
<body>
	<div id="container">
		<h3>已经成功解散团队！</h3>
		<h4>接下来要：</h4>
		<button id='back'>返回主页</button>
		<button id='build'>另建团队</button>
	</div>
	<%include frameuse.ejs%>
	<script>
		document.getElementById('back').onclick = function(){
			zPost('/main');
		}
		document.getElementById('build').onclick = function(){
			zPost('/DealWithTeam');
		}
	</script>
</body>
</html>
	`,
}