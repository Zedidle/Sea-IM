const uid = document.getElementById('getuid').value;
let loginlist = JSON.parse(document.getElementById('getloginlist').value);
console.log(603)
console.log(loginlist)
var main = new Vue({

  components:{

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
          userEnsure:{ uid:uid, },
        }
      },
      methods:{
        logOff:function(){ window.location.href='/logOff'; },
        getPersonInfo:function(){ formPostUrl('/people',this.userEnsure);},
        getTeamsInfo:function(){ formPostUrl('/myteam',this.userEnsure);},
        toBuildATeam:function(){ formPostUrl('/DealWithTeam',this.userEnsure);},
      }
    },

    'user-info':{
      props:['uid','user_info'],
      template:`
        <div v-bind:class='{userinfo_wrap:true}' id='user_info' >
          <div v-bind:class='{userinfo_avator:true}'><img v-bind:class='{userinfo_avator_img:true}' v-bind:src='info.headImg'></div>
          <div id='intro' v-bind:class='{userinfo_intro:true}'>
            <div id='name' >
              <div id='nick_name'>{{info.name}}</div>
              <div id='user_name'>{{uid}}</div>
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
          reg:/&#34;/g,
          info:JSON.parse(this.user_info.replace(this.reg, '\"')),
        }
      },
      methods:{
        toggleDomore:function(){
          if($('#domore').__proto__.judge===undefined){
            $('#domore').__proto__.judge = false;
          }
          if($('#domore').judge){
            $('#domore').css('width','0px');
          }else{
            $('#domore').css('width','60px');
          }
          $('#domore').__proto__.judge = !$('#domore').__proto__.judge;
        },

      },
    },

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
        removeSearchInfo:function(){ if($('#search-info')){ $('#search-info').remove(); } },
        closeCheckInfo:function(){
          $('#search_uid').val('');
          $('#search_uid').css('width','78%');
          this.removeSearchInfo();
        },
        searchSubmit:function(){ this.removeSearchInfo(); this.getSearchResponse(); },
        
        createSearchTeamInfo:function(t){
          $('#search-info').append(`
            <div id='search-team'>
              <div id='teamImg'><img src=`+t.headImg+`></div>
              <div id='tinfo'>
                <div id='teamname'>团队名: `+t.name+`</div>
                <div id='builder'>ID: `+t.uid+`</div>
                <div id='level'>级别: `+t.level+`</div>
                <div id='membernumber'>人数: `+t.membernumber+`</div>
                <div id='major'>主修: `+t.major+`</div>
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
              if(judge==='ok'){ formPostUrl('/join',data); }
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
          main.messtype = 'search';
          main.to = searchComponent.searchId;
          console.log(main.to)
          main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();
          console.log(main.nameOfmessageframe)
        })

        $('#star').click(function(){
          var data = { sid:searchComponent.searchId, uid:searchComponent.uid };
          var J_data = JSON.stringify(data);
            $.post('/star','J_data='+J_data,function(data){
              var judge = JSON.parse(data);
              var t;
              judge?t = '成功标记该用户!':t = '已经标记该用户！';
              $('#search-person').prepend("<li class='alert alert-success' role='alert'>"+t+"</li>");
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
          var 
            data = { uid:this.searchId },
            J_data = JSON.stringify(data);

          var searchComponent = this;
          $.post("/search","J_data="+J_data,function(data){
            var 
              team = data.team,
              person = data.person;
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
      props:['type','info'],
      template:`
        <ul>
        <li v-for='i in _info' v-on:click='show_messageFrame($event)' :style='li_height'>
          <div class='info'>
            <div class='name'>{{i.name}} <span class="badge">{{i.unReadNumber}}</span> </div>
            <span class='uid' >{{i.uid}}</span>
            <div class='introduce'>{{i.introduce}}</div>
          </div>
          <div class='avator' :style='avator_w'><img :src=i.headImg></div>
        </li>
        </ul>
      `,
      computed:{
        li_height:function(){
          var h;
          switch(this.type){
            case('recent'):{h='50'; break;};
            case('star'):{h='60'; break;};
            case('team'):{h='100'; break;};
            case('stranger'):{h='40'; break;};
          }
          return { height:h+'px' };
        },
        avator_w:function(){
          var w,b_radius;
          switch(this.type){
            case('recent'):{w='50'; b_radius='50'; break;};
            case('star'):{w='60'; b_radius='50'; break;};
            case('team'):{w='90'; b_radius='0'; break;};
            case('stranger'):{w='40'; b_radius='50'; break;};
          }        
          return { width:w+'px', borderRadius:b_radius+'%',};
        },

        _info:function(){
          var reg = /&#34;/g;
          return JSON.parse(this.info.replace(reg,"\""));
        }
      },
      methods:{
        show_messageFrame:function(event){
          main.messtype=this.type;
          var e = $(event.target);
          main.messageframeSeen=true;
          main.nameOfmessageframe = e.find('.name').text()||e.parent().find('.name').text()||e.parent().parent().find('.name').text();
          main.to = e.find('.uid').text()||e.parent().find('.uid').text()||e.parent().parent().find('.uid').text();
        },

        // stranger_close:function(){
        //   $(this).parent().remove();
        //   var 
        //     str_uid = $(this).siblings('uid').text(),
        //     data = { uid:userN, str_uid:str_uid },
        //     J_data = JSON.stringify(data);
        //   $.post('/close_str_mess','J_data='+J_data);
        // },
      },
    },

  },

    

  el:'#main',
  data:{
    isstranger:false,
    isteam:false,
    messtype:'',
    to:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    isMessContentSeen:{
      recent:true,
      star:false,
      team:false,
      stranger:false,
    },
  },
  methods:{
    dealwithbadge:function(){
      let s = $('#strangerContent'); 
      s.find('.badge').remove();
      if(!$(s.parentNode).find('.badge').length){ $('#strangeOption').find('.badge').remove(); }
      s.siblings().css('height','40px');  
      s.css('height','350px');
    },
    getMoreMess:function(){
      console.log('getMoreMess');
      $('#messageframe_cont').append();
    },
    firstReceive:function(){

    },
    addUnReadNumber:function(msg){
      
    },
    createMessDiv:function(msg){
      var f;
      (msg.uid===uid)?f="style='float:right'":f="style='float:left'";
      $('#messageframe_cont').append(`
        <div class="messli" ${f}>
          <div class='avator' ${f}><img src='${msg.headImg}'/></div>
          <div class='info' ${f}>
            <div><div class='name' ${f}>${msg.name}  ${msg.time}</div></div>
            <div class="content" ${f}>${msg.content}</div>
          </div>
        </div>
      `);
      $('#messageframe_input').val('');
      var cont = document.getElementById('messageframe_cont');
      cont.scrollTop = cont.scrollHeight;
    },
    judgeMess:function(msg){
      if(msg.type===main.messtype&&(msg.uid===main.to||msg.uid===uid)){ 
        this.createMessDiv(msg);
      }else{
        var l = true;
        for(let i of loginlist[msg.type]){
          if(i===msg.uid){ l = false; break;}
        }
        if(l){ this.addMessLi(msg); }
        this.addUnReadNumber(msg);
      }
    },
    addMessLi:function(){

    },
    messageCome:function(msg){
      console.log(msg)
      this.dealwithbadge();
      this.judgeMess(msg);
    },

  //  setStrangerFirstLiFunctions:function(){
  //   var last_li = $('#strangeContent ul').find('li').first();
  //   last_li.click(function(){
  //     $(this).find('.badge').remove();
  //     $(this).siblings().css('height','40px');
  //     $(this).css('height','350px')
  //   })

  //   last_li.find('close').click(function(){
  //     $(this).parent().remove();
  //     var str_uid = $(this).siblings('uid').text();
  //     var data = {
  //       uid:userN,
  //       str_uid:str_uid
  //     }
  //     var J_data = JSON.stringify(data);
  //     $.post('/close_str_mess','J_data='+J_data);
  //   })

  //   last_li.find('content').append(p);

  //   last_li.find('input').keyup(function(e){
  //     var keyCode = e.keyCode||e.which||e.charCode;
  //     if(keyCode===13){
  //       var 
  //         mess_content  = this.value.trim(),
  //         to = $(this).parent().siblings('uid').text(),
  //         that = $(this);
  //       this.value = '';
  //       strangeMessageEmit(that,mess_content,to);
  //     }
  //   })

  //   last_li.find('sub_btn').click(function(){
  //     var 
  //       mess_content = $(this).siblings('input').val().trim(),
  //       to = $(this).parent().siblings('uid').text(),
  //       that = $(this);
  //     $(this).siblings('input').val('');
  //     strangeMessageEmit(that,mess_content,to);
  //   })

  // },

  // strangerMessFirstReceive:function(isFirstReceive){
  //   if(isFirstReceive){ strangerContentAddNew(); setStrangerFirstLiFunctions(); }
  // },

//     setLastStarLiClickFunction:function (){
//   var last_li = $('#starContent ul').find('li').last();
//   last_li.click(function(){
//     $(this).find('.badge').remove();
//     if(!$(this.parentNode).find('.badge').length){
//       $('#starOption').find('.badge').remove();
//     }
//     messageframeUpdate();
//   })
// },

    // addMessageComeTips:function(){
    //   var star_uids = $('#starContent').find('uid');
    //   for(var i=0;i<star_uids.length;i++){
    //     if(star_uids[i].innerText===msg.from){
    //       if(!$(star_uids[i]).siblings('.badge').length){
    //         $(star_uids[i]).after('<span class="badge">!</span>');
    //       }
    //     }
    //   }
    //   if(!$('#starOption .badge').length){
    //     $('#starOption').append('<span class="badge">!</span>').click(function(){
    //       $('#starOption .badge').remove();
    //     });
    //   }
    // },

    // getStarMessToFrame:function(uid_text){
    //   var data = { uid:this., star_uid:uid_text };
    //   var J_data = JSON.stringify(data);
    //   $.post("/get_star_mess",'J_data='+J_data,function(Data){
    //     Data.forEach(function(a){
    //       var 
    //         p = document.createElement('p'),
    //         cont = $('#messageframe_cont');
    //         p.innerText = '['+a.body.time+'] -:\n\t' + a.body.content;
    //         cont.append(p);
    //         cont[0].scrollTop = cont[0].scrollHeight;
    //     })
    //   })
    // },
    // messageframeUpdate:function(){
    //   var 
    //     name_text = $(this).find('name').text(),
    //     uid_text = $(this).find('uid').text();
    //     getStarMessToFrame(uid_text);
    // },

    sendMessage:function(){
      var v = $('#messageframe_input').val().trim();
      if(!v.length){ return; }
      else{
        var msg = {
          time:getTime(),
          type:this.messtype,
          content:v,
          to:this.to,
          from:uid
        }
        var J_msg = JSON.stringify(msg);
        socket.emit('chat',J_msg);
      }
    },
    messageframe_close:function(){
      this.messageframeSeen=false; 
      $('#messageframe_cont').html('');
      $('#messageframe_input').val('');
    },


//  receiveStrangerMess:function(){
//   for(var i=0;i<uids.length;i++){
//     if(uids[i].innerText===msg.from){
//       if(!$(uids[i]).siblings('.badge').length){
//         $(uids[i]).after('<span class="badge">!</span>');
//         $(uids[i]).parents('li').click(function(){
//           $(this).find('.badge').remove();
//         })
//       }
//       var content = $(uids[i]).siblings('content');
//       content.append(p);
//       content[0].scrollTop=content[0].scrollHeight;
//       isFirstReceive = false; break;
//     }
//   }
//   strangerMessFirstReceive(isFirstReceive);
// },

    hideDomore:function(){
      $('#domore').css('width','0px');
      $('#domore').__proto__.judge = false;
    },
    resetOption:function(){
      for(var i=0;i<$('.sOption').length;i++){
        $('.sOption').eq(i).css('background','#fff');
      }
      this.isMessContentSeen.recent=false;
      this.isMessContentSeen.star=false;
      this.isMessContentSeen.team=false;
      this.isMessContentSeen.stranger=false;    
    },
    recentContentSeen:function(){
      this.resetOption();
      recentOption.style.background='transparent';
      this.isMessContentSeen.recent=true;
    },
    starContentSeen:function(){
      this.resetOption();
      messOption.style.left='-33.3%';
      starOption.style.background='transparent';
      this.isMessContentSeen.star=true;
    },
    teamContentSeen:function(){
      this.resetOption();
      messOption.style.left='-66.6%';
      teamOption.style.background='transparent';
      this.isMessContentSeen.team=true;
    },
    strangerContentSeen:function(){
      this.resetOption();
      strangerOption.style.background='transparent';
      this.isMessContentSeen.stranger=true;
    },
    // lastLiMS:function(){
    //   var to = $(this).find('id').text();
    //   last_li.click(function(){
    //   $.post("/get_team_mess","data="+to,function(data){
    //     var team_messages;
    //     if(typeof data==='string'){
    //       team_messages = JSON.parse(data);
    //     }else{
    //       team_messages = data;
    //     }
    //     if(team_messages.length){
    //       for(var i=0;i<team_messages.length;i++){
    //         var p = document.createElement('p');
    //         p.innerText = '['+team_messages[i].time+']'+team_messages[i].from+':\n\t'+team_messages[i].content;
    //         $('messageframe cont').append(p);
    //       }
    //     }
    //   })

    //   $('messageframe say subm').click(function(){
    //     var 
    //       input = $(this).siblings('input'),
    //       mess = input.val();
    //       input.val('');
    //     teamMessageEmit(mess);
    //   })
    // })
    // }
  },

});


console.log(uid)
socket.on(uid,function(J_msg){
  var msg = JSON.parse(J_msg);
  main.messageCome(msg);
})


//   socket.on(uid,function(J_msg){
//     var msg = JSON.parse(J_msg);
//     var messageframe = $('messageframe');
//     if(msg.from!==userN){
//       if(!messageframe.length){
//         document.getElementById('tipvoice').play();
//         teamMessageCome();
//       }else{
//         if(messageframe.find('id').text()===msg.to){
//           var 
//             cont = messageframe.find('cont'),
//             p = document.createElement('p');
//           p.innerText = '['+msg.time+']'+msg.from+':\n\t'+msg.content;
//           cont.append(p);
//           cont[0].scrollTop=cont[0].scrollHeight;
//         }else{
//           teamMessageCome();
//         }
//       }
//     }
//   });

// //socket for stars and strangers
// socket.on(userN,function(J_msg){
// var 
//   msg = JSON.parse(J_msg),
//   messageframe = $('messageframe');
// //first judge the messages whether from your star;
// var isStar;
// for(var i=0;i<stars.length;i++){
//   if(msg.from===stars[i]){
//     isStar=true; break;
//   }
// }
// if(isStar){
// //And judge the messageframe whether opening
//   if(!messageframe.length){
//     document.getElementById('tipvoice').play();
//   }
//   if(messageframe.find('username').text()===msg.from){
//     contentAddMess()
//   }else{
//     addMessageComeTips()
//   }
// }else{
//   strangerMessTip();
//   receiveStrangerMess();
// }
// });