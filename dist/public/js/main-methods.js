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
        uid:uid,
        to:main.messto
      };
      $.post('/deleteRecentChat',data,function(data_back){
        vRemoveThePeopleInRecent(data.to);
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