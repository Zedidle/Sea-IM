function v_methods(){
  return {
    closeMoreinfo:function(){
      this.moreinfoSeen=false;
    },
    checkMoreinfo:function(){
      var data = {
        type:this.messtype,
        check_uid:this.messto
      };
      postChange("/getMoreinfo",data,function(d){
        main.messInfo = d;
      });
      this.moreinfoSeen=true;
    },
    getMoreMessageOnFrame:function(){
      var skip = document.querySelectorAll('#messageframe_cont>.messli').length;
      var data = {
        receive_uid:uid,
        from_uid:main.messto,
        type:main.messtype
      };
      $.post('/getmess', data, function(messages){
        console.log(messages);
        if(messages){
          var l = messages.length;
          for(var i=0;i<5;i++){
            main.gotMessCreateMessDiv(messages[l-1-skip-i]);
          }
        }else{
          main.changeGetMoreContent();
        }
      });
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
      var msg_type = msg.type==='team'?'team':'people';
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
        this.changeGetMoreContent();
        return false;
      }
      var f = judgeTypeforFloatDirection(msg,uid);
      var msgContent = main.expressionsParse(msg.content);
      $('#messageframe_cont').prepend(v_createMessDiv(msg,f,msgContent));
      var cont = document.getElementById('messageframe_cont');
      cont.scrollTop = 0;
    },
    changeGetMoreContent:function(){
        var getMessBtn = $('.getMoreMessageOnFrame_btn')[0];
        getMessBtn.innerText = 'No More';
        setTimeout(function(){
          getMessBtn.innerText = 'Get More Message';
        },1500);
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
        var t = help_expressionSwitch(msgMatch.slice(2,-1));
        msgContent = msgContent.replace(
          /#\(.{1,4}\)/,
          "<div class='expression_chatting"+
            "style='background-image:url(img/faces.png);"+ 
            "background-position: left -"+t*30+"px; '>"+
          "</div>"
          );
      }
      return msgContent;
    },
    addRecentLi:function(info){
      
      var havelevel = info.level;
      var con = new Object({});
      con.h = havelevel?'80px':'55px';
      con.borderR = havelevel?'0%':'50%';
      con.avator_w = havelevel?'70px':'50px';
      con.type = havelevel?'team':'people';
      $('#recent').prepend(v_addRecentLi_recent(con));
      $('#recent li').first().click(function(){
        var unread_badge = $(this).find('.badge')[0]||$(this).parent('li').find('span.badge')[0];
        var unreadNumber = unread_badge.innerText;
        unread_badge.innerText = '';
        unread_badge.style.display = 'none';
        main.moreinfoSeen=false;
        main.messtype='recent';
        main.messageframeSeen=true;
        main.isteam = false;
        main.nameOfmessageframe = this.getElementsByClassName('name')[0].innerText;
        main.messto = this.getElementsByClassName('uid')[0].innerText;
        main.getUnreadMess(main.messto,unreadNumber,'recent');
        document.getElementById('messageframe_cont').innerHTML = '';
      });
    },

    getUnreadMess:function(get_uid,unreadNumber,type){
      var data = {
        uid:uid,
        get_uid:get_uid,
        unreadNumber:unreadNumber,
        type:type
      };
      postChange('/getUnreadMess',data,function(d){
        for(i=0;i<d.length;i++){
          main.createMessDiv(d[i]);
        }
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
        var lrt = loginlist.recent_team;
        for(i=0;i<lrt.length;i++){
          if(lrt[i]===msg.uid||lrt[i]===msg.to){
            exist = true;
            break;
          }
        }
      }else{
        //check whether the recent_people exist;
        var lrp = loginlist.recent_people;
        for(i=0;i<lrp.length;i++){
          if(lrp[i]===msg.uid||lrp[i]===msg.to){
            exist = true;
            break;
          }
        }
      }
      if(!exist){
        if(msg.uid===uid){
          //who send msg and who receive msg is the same;  
          var d = {  
            uid:msg.to, 
            type:msg.type
          };
          //link with router/unreadnumber.js g64,
          postChange('/justGetInfo',d,function(data){
            if(msg.type==='team'){
              loginlist.recent_team.push(msg.uid);
            }else{
              loginlist.recent_people.push(msg.to);
            }
            main.addRecentLi(data);
            var recentFirstLiUnreadnumber = $('ul#recent').find('li').eq(0).find('.name span.badge')[0];
            recentFirstLiUnreadnumber.innerText = '';
            recentFirstLiUnreadnumber.style.display = 'none';
          });
        }else{
          if(msg.type==='team'){
            loginlist.recent_team.push(msg.uid);
          }else{
            loginlist.recent_people.push(msg.uid);
          }
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
          time:mTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:uid
        };
        var J_msg = JSON.stringify(msg);
        socket.emit('chat',J_msg);
      }
    },
    starOrUnstar:function(){
      var stars = loginlist.star;
      var data = {
        uid:uid,
        to:main.messto,
        isStar:false,
      };
      if(main.messtype!=='team'&&stars.length){
        for(var i=0;i<stars.length;i++){
          if(stars[i]===main.messto){
            data.isStar = true;
          }
        }
      }
      postChange('/starOrUnstar',data,function(data_back){
        if(data.isStar){
          v_removeThePeopleInStar(data.to);
          loginlist.star.pull(data.to);
        }else{
          v_addThePeopleInStar(data_back);
          loginlist.star.push(data.to);
        }
      });
    },
    deleteTheRecentChat:function(){
      var data = {
        uid:uid,
        to:main.messto
      };
      postChange('/deleteRecentChat',data,function(data_back){
        v_removeThePeopleInRecent(data.to);
      });
      main.messageframe_close();
    },
    exitTeam:function(){
      if(confirm('Ensure to Exit?')){
        var data = {
          uid:uid,
          tid:main.messto
        };
        postChange('/exitTeam',data,function(){
            v_removeTheTeamInList(data.tid,'recent');
            v_removeTheTeamInList(data.tid,'team');
            main.messageframe_close();
        });
      }
    },

    showMembers:function(){
      var data = {
        tid:main.messto
      };
      main.teamMembersSeen = true;
      postChange('/showMembers',data,function(_infos){
        var teamMembers_ul = document.querySelector('.teamMembers>ul');
        for(var i=0;i<_infos.length;i++){
          $(teamMembers_ul).append(v_teamMembers_template(_infos[i]));         
        }
      });
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
      document.getElementById('messageframe_cont').innerHTML = '';
      document.getElementById('messageframe_input').value = '';
    },

    //hide the domore model,
    hideDomore:function(){
      document.getElementById('domore').style.width = '0px';
      $('#domore').j = false;
    },

    listSeen:function(event,type){
      $('.sOption>span').css('color','#fff');
      this.isMessageListSeen.recent=false;
      this.isMessageListSeen.star=false;
      this.isMessageListSeen.team=false;
      var target = event.target.querySelector('span')||event.target;
      $(target).css('color','#60DDFF');
      this.isMessageListSeen[type]=true;
    },
  };
}
