const uid = document.getElementById('getuid').value;
const userEnsure = {uid:uid};
var loginlist = JSON.parse(document.getElementById('getloginlist').value);
var punRead = JSON.parse(document.getElementById('getpunRead').value);
var tunRead = JSON.parse(document.getElementById('gettunRead').value);


var main = new Vue({

  components:{
    'domore-part':{
      template:v_domore_part_template(),
      data:function(){},
      methods:{
        logOff:function(){
          if(confirm('确认注销？')){ formPost('/logOff',userEnsure); }
        },
        getPersonInfo:function(){ formPost('/people',userEnsure);},
        getTeamsInfo:function(){ formPost('/myteam',userEnsure);},
        toBuildATeam:function(){ formPost('/DealWithTeam',userEnsure);},
      }
    },

    //the user info
    'user-info':{
      props:['user_info'],
      template:v_user_info_template(),
      data:function(){
        return {
          info:JSON.parse(regKeepJSON(this.user_info)),
        }
      },
      methods:{
        toggleDomore:function(){
          var dp = $('#domore').__proto__;
          if(dp.j===undefined){ dp.j = false; };
          document.getElementById('domore').style.width = (dp.j?'0':'70')+'px'; 
          dp.j = !dp.j;
        },
      },
    },

    //search content 
    'search-content':{
      template:v_search_content_template(),
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
        getSearchResponse:function(){
          this.searchId = document.getElementById('search_uid').value.trim();; 
          if(!this.searchId||this.searchId===uid){ return; }
          document.getElementById('search_uid').style.width='70%';
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
        createSearchTeamInfo:function(t){
          $('#search-info').append(v_createSearchTeamInfo_template(t));
        },
        setSearchTeamFunctions:function(){
          var searchContent = this;
          $('#join').click(function(){
            var data = { uid:uid, tid:searchContent.searchId }
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
          $('#search-info').append(v_createSearchPersonInfo_template(p));
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
            uid:uid
          };
          var J_data = JSON.stringify(data);
            $.post('/star','J_data='+J_data,function(data){
              var t = JSON.parse(data)?'成功标记该用户!':'已经标记过！';
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
                  main.nameOfmessageframe = this.getElementsByClassName('name')[0].innerText;
                  main.messto = this.getElementsByClassName('uid')[0].innerText
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


      }
    },



    'mess-lis':{
      props:['type','info','punread','tunread'],
      template:v_mess_li_template(),
      computed:{
        punR:function(){ return JSON.parse(regKeepJSON(this.punread)); },
        tunR:function(){ return JSON.parse(regKeepJSON(this.tunread)); },
        _info:function(){ return JSON.parse(regKeepJSON(this.info)); },
      },
      methods:{
        li_height:function(havelevel){
          var h = this.type==='recent'?
                  havelevel?'80':'50':
                  this.type==='star'?'60':'100';
          return { height:h+'px',overflow:'hidden', };
        },

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
          unread_badge.innerText = '';
          unread_badge.style.display = 'none';
          var data = {
            type:haslevel?'team':'people',
            uid:li_uid,
            to:uid,
            checked:true
          }
          postChange('/dealwithunread',data,function(d){});
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
          document.getElementById('messageframe_cont').innerHTML = '';
          main.nameOfmessageframe = e.find('.name').text()||e.parent().find('.name').text()||e.parent().parent().find('.name').text();
          main.messto = li_uid;
          main.getUnreadMess(main.messto,unreadNumber,main.messtype);
        },
      },
    },
    // 'member-infos':{
    //   props:['infos'],
    //   template:v_member_infos_template(this._infos),
    //   computed:{
    //     _infos:function(){ return JSON.parse(regKeepJSON(this.infos)); },
    //   },
    //   methods:{
    //   }
    // }
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
    teamMembersSeen:false,
    loginlist:loginlist,
    messtype:'',
    messto:'',
    messgetTimes:0,
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
      var data = {
        receive_uid:uid,
        from_uid:main.messto,
        type:main.messtype,
        // skip:document.getElementById('messageframe_cont').getElementsByClassName('messli').length,
        skip:document.querySelectorAll('#messageframe_cont>.messli').length,
      }
      postChange('/getmess',data,function(res){
        for(let i of res){ main.gotMessCreateMessDiv(i); }
        main.messgetTimes += 1;
      })
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

      //there is two way to judge whether the li exist:
      //1: check the loginlist; this way is easy and more quitely,
      //2: check the ul#recent; this way is main to change the unread of the li,

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
          break;
        }
      }
      this.addUnReadInDB(msg_type,msg.uid,msg.to);
    },  
    gotMessCreateMessDiv:function(msg){
      if(!msg){
        var getMessBtn = document.getElementsByClassName('getMoreMessageOnFrame_btn')[0];
        getMessBtn.innerText = 'No More';
        setTimeout(function(){
          getMessBtn.innerText = 'Get More Message';
        },1500)
        return false;
      }
      // if(msg.type==='team'){
      //   var f=(msg.from_user===uid)?"style='float:right'":"style='float:left'";
      // }else{
      //   var f=(msg.uid===uid)?"style='float:right'":"style='float:left'";
      // }
      var f = judgeTypeforFloatDirection(msg,uid);
      var msgContent = main.expressionsParse(msg.content);
      $('#messageframe_cont').prepend(v_createMessDiv(msg,f,msgContent));
      // $('#messageframe_cont').prepend(`
      //   <div class="messli" ${f}>
      //     <div class='avator' ${f}><img src='${msg.headImg}'/></div>
      //     <div class='info' ${f}>
      //       <div><div class='name' ${f}>${msg.name}  ${msg.time}</div></div>
      //       <div class="content" ${f}>${msgContent}</div>
      //     </div>
      //   </div>
      //   `);
      var cont = document.getElementById('messageframe_cont');
      cont.scrollTop = 0;
    },
    //when the mess come, if messageFrame is opning, check the messtype and messto, 
    //if satisfy the condition, it will run this function to show the message.
    createMessDiv:function(msg){
      var f = judgeTypeforFloatDirection(msg,uid);
      var msgContent = main.expressionsParse(msg.content);
      $('#messageframe_cont').append(v_createMessDiv(msg,f,msgContent));
      document.getElementById('messageframe_input').value = '';
      var cont = document.getElementById('messageframe_cont');
      cont.scrollTop = cont.scrollHeight;
    },
    expressionsParse:function(msgContent){
      while(msgContent.match(/\#\(.{1,4}\)/)){
        var msgMatch = String(msgContent.match(/\#\(.{1,4}\)/));
        check(msgMatch,'msgMatch');
        var t = help_expressionSwitch(msgMatch.slice(2,-1));
        msgContent = msgContent.replace(/#\(.{1,4}\)/,
          `<div class='expression_chatting'
            style='background-image:url(img/faces.png); 
            background-position: left -${t*30}px; '>
          </div>`
          )
      }
      return msgContent;
    },

    addRecentLi:function(info){
      var havelevel = info.level;
      var con = new Object();
      con.h = havelevel?'80px':'55px';
      con.borderR = havelevel?'0%':'50%';
      con.avator_w = havelevel?'70px':'50px';
      con.type = havelevel?'team':'people';
      $('#recent').prepend(v_addRecentLi_recent());
      $('#recent li').first().click(function(){
        var unread_badge = $(this).find('.badge')[0]||$(this).parent('li').find('span.badge')[0];
        var unreadNumber = unread_badge.innerText;
        unread_badge.innerText = '';
        unread_badge.style.display = 'none';
        main.moreinfoSeen=false;
        main.messtype='recent';
        main.messageframeSeen=true;
        main.isteam = false;
        main.nameOfmessageframe = this.getElementsByClassName('name')[0].innerText
        main.messto = this.getElementsByClassName('uid')[0].innerText
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
        for(let i=0;i<d.length;i++){ main.createMessDiv(d[i]); };
      });
    },

    //when user receive any message, run this function;
    messageCome:function(msg){

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
      if(!exist){
        if(msg.uid===uid){
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
          d.onclick = help_addFaceMark;
          faces.appendChild(d);
        }
    },

    //when user send any message, run this function,
    sendMessage:function(){
      var v = document.getElementById('messageframe_input').value.trim();
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

    exitTeam:function(){
      if(confirm('Ensure to Exit?')){
        var data = {
          uid:uid,
          tid:main.messto
        }
        postChange('/exitTeam',data,function(){
            v_removeTheTeamInList(data.uid,data.tid,'recent');
            v_removeTheTeamInList(data.uid,data.tid,'team');
        });
      }
    },

    showMembers:function(){
      console.log('showMembers');
      var data = { tid:main.messto };
      main.teamMembersSeen = true;
      postChange('/showMembers',data,function(_infos){
        var teamMembers_ul = document.querySelector('.teamMembers>ul');
        console.log(teamMembers_ul);
        for(let li of _infos){
          console.log(li);
          $(teamMembers_ul).append(v_teamMembers_template(li));         
        }
      })
    },
    closeTeamMembers:function(){
      document.querySelector('.teamMembers>ul').innerHTML = '';
      this.teamMembersSeen=false;
    },
    //when the < of the top of left of the massageframe be clicked, run this function,
    messageframe_close:function(){
      this.messageframeSeen=false;
      this.teamMembersSeen=false;
      this.messtype='';
      this.messto='';
      this.messgetTimes=0;
      document.getElementById('messageframe_cont').innerHTML = '';
      document.getElementById('messageframe_input').value = '';
    },

    //hide the domore model,
    hideDomore:function(){
      document.getElementById('domore').style.width = '0px';
      $('#domore').__proto__.j = false;
    },

    listSeen:function(event,type){
      $('.sOption>span').css('color','#fff');
      this.isMessageListSeen.recent=false;
      this.isMessageListSeen.star=false;
      this.isMessageListSeen.team=false;
      var target = event.target.querySelector('span')||event.target;
      $(target).css('color','#70C1B9');
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