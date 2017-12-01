const uid = document.getElementById('getuid').value;
var loginlist = JSON.parse(document.getElementById('getloginlist').value);
var punRead = JSON.parse(document.getElementById('getpunRead').value);
var tunRead = JSON.parse(document.getElementById('gettunRead').value);

var main = new Vue({

  components:{

    //get more domore thing to do; 
    'domore-part':{
      props:['uid'],
      template:`
      <div id='domore'>
      <div id="logOff" v-on:click="logOff">注销</div>
      <div id='person' v-on:click='getPersonInfo' class='ele' data-toggle="tooltip" data-placement="left" title="个人信息">
        <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
      </div>
      <div id='myteam' v-on:click='getTeamsInfo' class='ele' data-toggle="tooltip" data-placement="top" title="团队">
        <span class="glyphicon glyphicon-fire" aria-hidden="true"></span>
      </div>
      <div id="buildTeam" v-on:click='toBuildATeam' class='ele' data-toggle="tooltip" data-placement="bottom" title="创建团队">
        <span class="glyphicon glyphicon-grain" aria-hidden="true"></span>
      </div>
      </div>
    `,
      data:function(){
        return {
          userEnsure:{ uid:uid },
        }
      },
      methods:{
        logOff:function(){
          if(confirm('确认注销？')){ formPost('/logOff',this.userEnsure); }
        },
        getPersonInfo:function(){ formPost('/people',this.userEnsure);},
        getTeamsInfo:function(){ formPost('/myteam',this.userEnsure);},
        toBuildATeam:function(){ formPost('/DealWithTeam',this.userEnsure);},
      }
    },

    //the user info
    'user-info':{
      props:['uid','user_info'],
      template:`
        <div v-bind:class='{userinfo_wrap:true}' id='user_info' >
          <div v-bind:class='{userinfo_avator:true}'><img v-bind:class='{userinfo_avator_img:true}' v-bind:src='info.headImg'></div>
          <div id='intro' v-bind:class='{userinfo_intro:true}'>
            <div id='name' >
              <div id='nick_name'>{{info.name}}</div>
            </div>
            <div id='introduce' v-bind:class='{userinfo_introduce:true}'>{{info.introduce}}</div>
          </div>
          <div id='set' v-bind:class='{userinfo_set:true}' v-on:click='toggleDomore' >
            <span class='glyphicon glyphicon-list' aria-hidden='true'></span>
          </div>
        </div>
      `,
      data:function(){
        return {
          info:JSON.parse(regKeepJSON(this.user_info)),
        }
      },
      methods:{
        toggleDomore:function(){
          var dp = $('#domore').__proto__;
          if(dp.j===undefined){ dp.j = false; };
          $('#domore').css('width',(dp.j?'0':'70')+'px');
          dp.j = !dp.j;
        },
      },
    },

    //search content 
    'search-content':{
      props:['uid'],
      template:`
        <div id='search-content' >
          <div id='search' v-on:keyup.13='searchSubmit'>
            <button id='sub' v-on:click='searchSubmit'>
              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
              查找
            </button>
          <input type="text" id='search_uid' name='search_uid' placeholder="请输入团队或用户的ID">
          <div v-bind:class='{search_close:true}' v-on:click='closeCheckInfo'>
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </div>
        </div>
      </div>
      `,
      methods:{
        removeSearchInfo:function(){ 
          if(document.getElementById('search-info')){ $('#search-info').remove(); }
        },
        closeCheckInfo:function(){
          document.getElementById('search_uid').value = '';
          document.getElementById('search_uid').style.width = '78%';
          this.removeSearchInfo();
        },
        searchSubmit:function(){ 
          this.removeSearchInfo(); 
          this.getSearchResponse(); 
        },
        createSearchTeamInfo:function(t){
          $('#search-info').append(`
            <div id='search-team'>
              <div id='teamImg'><img src=`+t.headImg+`></div>
              <div id='tinfo'>
                <div id='teamname'>团队名: `+t.name+`</div>
                <div id='builder'>ID: `+t.uid+`</div>
                <div id='level'>级别: `+t.level+`</div>
                <div id='membernumber'>人数: `+t.membernumber+`</div>
                <div id='teamintro'>简介: `+t.introduce+`</div>
              </div>
              <div id='join'> 
                <span class='glyphicon glyphicon-map-marker' aria-hidden='true'></span>  Join in
              </div>
            </div>
          `);
        },
        setSearchTeamFunctions:function(){
          var searchContent = this;
          $('#join').click(function(){
            var data = { uid:searchContent.uid, tid:searchContent.searchId }
            var J_data = JSON.stringify(data);
            $.post('/join_judge','J_data='+J_data,function(judge){
              if(judge==='ok'){ formPost('/join',data); }
              else{
                $('#search-team').append("<li class='alert alert-info' role='alert'>"+judge+"</li>");
              }
            })
          }) 
        },

        createSearchPersonInfo:function(p){
          $('#search-info').append(`
            <div id='search-person'>
            <div id='personImg'><img src=`+p.headImg+`></div>
            <div id='pinfo'>
              昵称: <div id='name'>`+p.name+`</div>
              <div id='sex'>性别: `+p.sex+`</div>
              <div id='hobby'>爱好: `+p.hobby+`</div>
              <div id='personIntro'>简介: `+p.introduce+`</div>
            </div>
            <div id='send'>
              <span class='glyphicon glyphicon-envelope' aria-hidden='true'></span>Mess
            </div>
            <div id='star'>
              <span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>Star
            </div>
            </div>
          `);
        },

      setSearchPersonFunctions:function(){
        var searchComponent = this;
        $('#send').click(function(){
          main.messageframeSeen = true;
          main.messtype = 'recent';
          main.messto = searchComponent.searchId;
          main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();
        })

        $('#star').click(function(){
          var data = { 
            sid:searchComponent.searchId,
            uid:searchComponent.uid
          };
          var J_data = JSON.stringify(data);
            $.post('/star','J_data='+J_data,function(data){
              var j = JSON.parse(data);
              var t = j?'成功标记该用户!':'已经标记过！';
              $('#search-person').prepend("<li class='alert alert-success' role='alert'>"+t+"</li>");
              if(j){
                $('#starContent ul').prepend(`
                  <li style='height:60px;'>
                    <div class='info'>
                      <div class='name'>${j.name} </div>
                      <span class='uid' >${j.uid}</span>
                      <div class='introduce'>${j.introduce}</div>
                    </div>
                    <div class='avator' style='width:60px; border-radius:50%;'><img src='${j.headImg}'></div>
                  </li>
                `);
                $('#star li').first().click(function(){
                  main.moreinfoSeen=false;
                  main.messtype='star';
                  main.messageframeSeen=true;
                  main.isteam = false;
                  main.nameOfmessageframe = $(this).find('.name').text();
                  main.messto = $(this).find('.uid').text();
                  document.getElementById('messageframe_cont').innerHTML = '';
                })
              }
            })
        })

        },

        addSearchTips:function(isTeamExist,isPersonExist){
          if(!isTeamExist){
            $('#search-info').append("<li class='alert alert-warning' role='alert'>没有团队</li>");
          }
          if(!isPersonExist){
            $('#search-info').append("<li class='alert alert-danger' role='alert'>没有用户</li>");
          }
        },

        getSearchResponse:function(){
          this.searchId = $('#search_uid').val().trim();; 
          if(!this.searchId||this.searchId===uid){ return; }
          $('#search_uid').css('width','70%');
          var J_data = JSON.stringify({ uid:this.searchId });
          var searchComponent = this;
          $.post("/search","J_data="+J_data,function(data){
            var team = data.team;
            var person = data.person;
            $('#search-content').append("<div id='search-info'></div>");
            if(team){
              searchComponent.createSearchTeamInfo(team);
              searchComponent.setSearchTeamFunctions();
            }
            if(person){
              searchComponent.createSearchPersonInfo(person);
              searchComponent.setSearchPersonFunctions();
            }
              searchComponent.addSearchTips(team,person);
          })
        },
      }
    },



    'mess-lis':{
      props:['type','info','punread','tunread'],
      template:`
        <ul v-bind:id='type'>
        <li v-for='i in _info' v-on:click='show_messageFrame($event,i.uid,i.level)' :style='li_height(i.level)'>
          <div class='info'>
            <div class='name'>{{i.name}} 
              <span class="badge" v-if=!i.level>{{punR[i.uid]}}</span> 
              <span class="badge" v-if=i.level>{{tunR[i.uid]}}</span>
            </div>
            <div class='li_type'>
              <span v-if=i.level>team</span>
              <span v-if=!i.level>people</span>
            </div>
            <span class='uid' >{{i.uid}}</span>
            <div class='introduce'>{{i.introduce}}</div>
          </div>
          <div class='avator' :style='avator_w(i.level)'><img :src=i.headImg></div>
        </li>
        </ul>
      `,
      computed:{
        punR:function(){ return JSON.parse(regKeepJSON(this.punread)); },
        tunR:function(){ return JSON.parse(regKeepJSON(this.tunread)); },
        _info:function(){ return JSON.parse(regKeepJSON(this.info)); },
      },
      methods:{
        //just judge whether the li have the level of team
        li_height:function(havelevel){
          var h = this.type==='recent'?
                  havelevel?'80':'50':
                  this.type==='star'?'60':'100';
          return { height:h+'px',overflow:'hidden', };
        },

        //just judge whether the li have the level of team
        avator_w:function(havelevel){
          var w,b_radius;
          switch(this.type){
            case('recent'):{
              w = havelevel?'78':'50';
              b_radius = havelevel?'0':'50';
              break;
            };
            case('star'):{w='60'; b_radius='50'; break;};
            case('team'):{w='90'; b_radius='0'; break;};
          }        
          return { width:w+'px', borderRadius:b_radius+'%',};
        },

        subUnread:function(unread_badge,uid,li_uid,haslevel){
          //sub the unread_badge in messli
          unread_badge.innerText = '';
          unread_badge.style.display = 'none';
          //sub the unreadNumber in DB
          var data = {
            type:haslevel?'team':'people',
            uid:li_uid,
            to:uid,
            checked:true
          }
          postChange('/dealwithunread',data,function(d){
            console.log(d);
          });
        },

        //when a messli be clicked, open the messageframe and get unread messages.
        show_messageFrame:function(event,li_uid,haslevel){
          main.moreinfoSeen = false;
          var e = $(event.target);
          var unread_badge = e.find('.badge')[0]||e.parents('li').find('.name span.badge')[0];
          var unreadNumber = parseInt(unread_badge.innerText);
          this.subUnread(unread_badge,uid,li_uid,haslevel);
          main.messtype=this.type;
          if(haslevel){ main.messtype='team'; }
          main.isteam = (main.messtype==='team')?true:false;
          main.messageframeSeen=true;
          $('#messageframe_cont').html('');
          main.nameOfmessageframe = e.find('.name').text()||e.parent().find('.name').text()||e.parent().parent().find('.name').text();
          main.messto = li_uid;
          main.getUnreadMess(main.messto,unreadNumber,main.messtype);
        },
      },
    },
  },










//Functions of the main chatting page. 

    
  el:'#main',
  data:{
    punRead:punRead,
    tunRead:tunRead,
    messInfo:{
      headImg:'???',
      uid: '???',
      name: '???',
      level: '???',
      membernumber:'???',  
      sex: '???',
      hobby: '???',
      birthday: '???',
      introduce: '???',
    },
    isteam:false,
    moreinfoSeen:false,
    loginlist:loginlist,
    messtype:'',
    messto:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    expressionSeen:false,
    isMessageListSeen:{
      recent:true,
      star:false,
      team:false,
    },
  },
  methods:{
    closeMoreinfo:function(){
      this.moreinfoSeen=false;
    },
    checkMoreinfo:function(){
      var data = {
        type:this.messtype,
        check_uid:this.messto
      }
      postChange("/getMoreinfo",data,function(d){ main.messInfo = d; });
      this.moreinfoSeen=true;
    },
    getMoreMessageOnFrame:function(){
      console.log('click the button and get more message');
      $('#messageframe_cont').append();
    },
    addUnReadInDB:function(msg_type,msg_uid,msg_to){
      var data = {
        type:msg_type,
        uid:msg_uid,
        to:msg_to,
        checked:false
      };
      postChange('/dealwithunread',data,function(d){});
    },
    addUnReadNumber:function(msg){
      //check the list in recent,add unread in recent list;

      var msg_type = msg.type==='team'?'team':'people';
      console.log(' message type: '+msg_type);

      //there is two way to judge whether the li exist:
      //1: check the loginlist; this way is easy and more quitely,
      //2: check the ul#recent; this way is main to change the unread of the li,

      // var haveTheLiInRecent = false;
      var recent_lis = $('ul#recent').find('li');
      for(var i=0;i<recent_lis.length;i++){
        //get every li in recent's type,uid and unreadnumber;
        var li_type = recent_lis.eq(i).find('.info .li_type span').text();
        var li_uid = recent_lis.eq(i).find('.info span.uid').text();
        var unread = recent_lis.eq(i).find('.name span.badge')[0];
        if(msg_type===li_type && msg.uid===li_uid){
          if(!unread.innerText){
            unread.innerText = 0;
            unread.style.display = 'inline-block';
          }
          unread.innerText = parseInt(unread.innerText)+1; 
          // haveTheLiInRecent = true;
          break;
        }
      }
      // if(!haveTheLiInRecent){ this.addRecentLi(msg); }; 
      this.addUnReadInDB(msg_type,msg.uid,msg.to);
    },  

    //when the mess come, if messageFrame is opning, check the messtype and messto, 
    //if satisfy the condition, it will run this function to show the message.
    createMessDiv:function(msg){
      if(msg.type==='team'){
        var f=(msg.from_user===uid)?"style='float:right'":"style='float:left'";
      }else{
        var f=(msg.uid===uid)?"style='float:right'":"style='float:left'";
      }
      var msgContent = msg.content;
      console.log('Before switch , the msgContent:'+ msgContent);
      while(msgContent.match(/\#\(.{1,4}\)/)){
        var msgMatch = String(msgContent.match(/\#\(.{1,4}\)/));
        check(msgMatch,'msgMatch');
        var t = expressionSwitch(msgMatch.slice(2,-1));
        msgContent = msgContent.replace(/#\(.{1,4}\)/,
          `<div class='expression_chatting'
            style='background-image:url(img/faces.png); 
            background-position: left -${t*30}px; '>
          </div>`
          )
      }
      console.log('After switch, the msgContent: \n'+ msgContent);

      $('#messageframe_cont').append(`
        <div class="messli" ${f}>
          <div class='avator' ${f}><img src='${msg.headImg}'/></div>
          <div class='info' ${f}>
            <div><div class='name' ${f}>${msg.name}  ${msg.time}</div></div>
            <div class="content" ${f}>${msgContent}</div>
          </div>
        </div>
      `);
      $('#messageframe_input').val('');
      var cont = document.getElementById('messageframe_cont');
      cont.scrollTop = cont.scrollHeight;
    },

    addRecentLi:function(info){
      console.log('add recentLi base on :');
      console.log(info);
      var havelevel = info.level;
      var con = new Object();
      con.h = havelevel?'80px':'55px';
      con.borderR = havelevel?'0%':'50%';
      con.avator_w = havelevel?'70px':'50px';
      con.type = havelevel?'team':'people';
      console.log(havelevel);
      console.log(con.h);
      console.log(con.borderR);
      console.log(con.avator_w);
      console.log(con.type);
      $('#recent').prepend(`
        <li style='height:${con.h};'>
          <div class='info'>
            <div class='name'>${info.name}
              <span class="badge">1</span>
            </div>
            <div class='li_type'>
              <span>${con.type}</span>
            </div>
            <span class='uid' >${info.uid}</span>
            <div class='introduce'>${info.introduce}</div>
          </div>
          <div class='avator' style='width:${con.avator_w}; border-radius:${con.borderR};' ><img src='${info.headImg}'></div>
        </li>
      `);

      $('#recent li').first().click(function(){
        var unread_badge = $(this).find('.badge')[0]||$(this).parent('li').find('span.badge')[0];
        var unreadNumber = unread_badge.innerText;
        console.log('get message number is :'+ unreadNumber);
        unread_badge.innerText = '';
        unread_badge.style.display = 'none';
        main.moreinfoSeen=false;
        main.messtype='recent';
        main.messageframeSeen=true;
        main.isteam = false;
        main.nameOfmessageframe = $(this).find('.name').text();
        main.messto = $(this).find('.uid').text();
        main.getUnreadMess(main.messto,unreadNumber,'recent');
        document.getElementById('messageframe_cont').innerHTML = '';
      })
    },

    getUnreadMess:function(get_uid,unreadNumber,type){
      var data = {
        uid:uid,
        get_uid:get_uid,
        unreadNumber:unreadNumber,
        type:type
      }
      postChange('/getUnreadMess',data,function(d){
        console.log("Get unread messages, the number is: "+d.length);
        for(let i=0;i<d.length;i++){ main.createMessDiv(d[i]); };
      });
    },

    //when user receive any message, run this function;
    messageCome:function(msg){
      console.log('the message:');
      console.log(msg);
      console.log('the main chat type: '+ main.messtype);
      console.log('the main to: '+ main.messto);

      if((msg.uid===main.messto)&&(msg.type===main.messtype||msg.type!=='team'&&main.messtype==='star')||
        msg.uid===uid&&msg.type!=='team'){
        this.createMessDiv(msg);
        if(msg.uid===uid&&msg.type==='team'&&main.messto!==msg.uid){
          this.addUnReadNumber(msg);
        }
      }else{
        var voiceSrc = msg.type!=='team'?'tmessageCome.wav':'pmessageCome.wav';
        document.getElementById('tipvoice').src='voice/'+ voiceSrc;
        this.addUnReadNumber(msg);
      }

      //judge the type of message,
      var exist = false;
      if(msg.type==='team'){
        //check whether the recent_team exist;
        for(var i of loginlist['recent_team']){
          if(i===msg.uid||i===msg.to){ exist = true; break; }
        }
      }else{
        //check whether the recent_people exist;
        for(var i of loginlist['recent_people']){
          if(i===msg.uid||i===msg.to){ exist = true; break; }
        }
      }
      console.log(loginlist['recent_people']);
      if(!exist){
        console.log("the recent li is not exist,");
        if(msg.uid===uid){
          console.log('this message is from yourself or your team!');
          //who send msg and who receive msg is the same;  
          var d = {  uid:msg.to, type:msg.type };
          //link with router/unreadnumber.js g64,
          postChange('/justGetInfo',d,function(data){
            msg.type==='team'?
              loginlist['recent_team'].push(msg.uid):
              loginlist['recent_people'].push(msg.to);
            main.addRecentLi(data);
            var recentFirstLiUnreadnumber = $('ul#recent').find('li').eq(0).find('.name span.badge')[0];
            recentFirstLiUnreadnumber.innerText = '';
            recentFirstLiUnreadnumber.style.display = 'none';
          })
        }else{
          msg.type==='team'?
            loginlist['recent_team'].push(msg.uid):
            loginlist['recent_people'].push(msg.uid);
          this.addRecentLi(msg);
        }
      }
    },

    showExpressions:function(){
      this.expressionSeen = !this.expressionSeen;

        var faces = document.getElementsByClassName('messageframe_expression')[0];
        faces.innerHTML = '';
       
        for(var i=0;i<50;i++){
          var d = document.createElement('div');
          d.style.backgroundPosition = 'left -'+i*30+'px';    
          d.style.backgroundImage = 'url(img/faces.png)'; 
          d.value = i;
          d.onclick = addFaceMark;
          faces.appendChild(d);
        }
        
        function addFaceMark(){
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
          console.log(21)
          main.expressionSeen = false;
          var input = document.getElementById('messageframe_input');
          var end = input.selectionEnd;
          var iv = input.value;
          input.value = iv.substr(0,end) + "#("+t+")" + iv.substr(end,iv.length);
        } 
    },

    //when user send any message, run this function,
    sendMessage:function(){
      var v = $('#messageframe_input').val().trim();
      if(v.length){
        var msg = {
          time:getTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:uid
        }
        var J_msg = JSON.stringify(msg);
        socket.emit('chat',J_msg);
      }
    },

    //when the < of the top of left of the massageframe be clicked, run this function,
    messageframe_close:function(){
      this.messageframeSeen=false;
      this.messtype='';
      this.messto='';
      $('#messageframe_cont').html('');
      $('#messageframe_input').val('');
    },

    //hide the domore model,
    hideDomore:function(){
      $('#domore').css('width','0px');
      $('#domore').__proto__.j = false;
    },

    listSeen:function(event,type){
      $('.sOption').css('background','#FCFEF4').css('color','#333');
      this.isMessageListSeen.recent=false;
      this.isMessageListSeen.star=false;
      this.isMessageListSeen.team=false;
      $(event.target).css('color','#70C1B9').css('background','transparent');
      this.isMessageListSeen[type]=true;
    },
  },
});

//listen the port of the user,
socket.on(uid,function(J_msg){ 
  main.messageCome(JSON.parse(J_msg)); 
});

//every 10 seconds to send a heartbeat package , keep on line;
setInterval(function(){
  socket.emit('heartbeat',uid); 
},10000);

















function expressionSwitch(expressionMark){
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
              case '吐':t = 15; break;
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