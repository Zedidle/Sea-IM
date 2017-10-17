const uid = document.getElementById('getuid').value;
var loginlist = JSON.parse(document.getElementById('getloginlist').value);
console.log('loginlist:');
console.log(loginlist)

// window.onbeforeunload = function(){
//     //先撤销了登录状态,注意：这里不能直接执行Ajax(而要用setTimeout)，会导致直接跳转
//     setTimeout(logOff,10);
//     //50ms后让＂100ms后制作返回登录状态＂这个事件进入事件队列
//     //为什么要这么做?
//     //因为:
//     //1.如果选择跳转页面，(100ms绝对会跳转)则定时器被撤销，导致＂返回登录状态＂　无法进入事件队列;
//     //2.如果选择取消跳转，则能让定时器顺利计时完成，让"返回登录状态"进入事件队列
//     setTimeout(relogin,50);
//     return "真的退出?";
// }
// function logOff(){
//     //撤销登录状态
//     var data={
//       uid:uid
//     };
//     postChange('/exit',data,function(d){
//       console.log(d.uid);
//     })
// }
// function relogin(){
//   //100ms后让＂返回登录状态＂进入事件队列
//   setTimeout(function(){
//     //返回登录状态
//     var data={
//       uid:uid
//     }
//     postChange('/relogin',data,function(d){
//       console.log(d.uid);
//     });
//   },100);
// }



var punReadNumber = JSON.parse(document.getElementById('getpunReadNumber').value);
var tunReadNumber = JSON.parse(document.getElementById('gettunReadNumber').value);



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
        logOff:function(){ 
          if(confirm('确认注销？')){
            formPostUrl('/logOff',this.userEnsure);
          }
        },
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
          if($('#domore').judge){ $('#domore').css('width','0px');
          }else{ $('#domore').css('width','60px'); }
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
        removeSearchInfo:function(){ 
          // if($('#search-info')){
          if(document.getElementById('search-info')){
            $('#search-info').remove(); 
          }
        },
        closeCheckInfo:function(){
          document.getElementById('search_uid').value = '';
          document.getElementById('search_uid').style.width = '78%';
          // $('#search_uid').val('');
          // $('#search_uid').css('width','78%');
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
              if(judge==='ok'){ 
                formPostUrl('/join',data); 
              }else{
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
              var t = judge?'成功标记该用户!':'已经标记过！';
              $('#search-person').prepend("<li class='alert alert-success' role='alert'>"+t+"</li>");
              if(judge){
                $('#starContent ul').prepend(`
                  <li style='height:60px;'>
                    <div class='info'>
                      <div class='name'>${judge.name} </div>
                      <span class='uid' >${judge.uid}</span>
                      <div class='introduce'>${judge.introduce}</div>
                    </div>
                    <div class='avator' style='width:60px; border-radius:50%;'><img src='${judge.headImg}'></div>
                  </li>
                `);
                $('#star li').first().click(function(){
                  main.moreinfoSeen = false;
                  main.messageframeSeen = true;
                  $('#messageframe_cont').html('');
                  main.messtype = 'star';
                  main.isteam = false;
                  main.nameOfmessageframe = $(this).find('.name').text();
                  main.to = $(this).find('.uid').text();
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
      props:['type','info','punreadnumber','tunreadnumber'],
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
        punR:function(){
          var reg = /&#34;/g;
          return JSON.parse(this.punreadnumber.replace(reg,"\""));
        },
        tunR:function(){
          var reg = /&#34;/g;
          return JSON.parse(this.tunreadnumber.replace(reg,"\""));
        },
        _info:function(){
          var reg = /&#34;/g;
          return JSON.parse(this.info.replace(reg,"\""));
        },
      },
      methods:{
        //just judge whether the li have the level of team
        li_height:function(havelevel){
          var h;
          switch(this.type){
            case('recent'):{
              if(havelevel){
                h='80';
              }else{
                h='55'; 
              }
              break;
            };
            case('star'):{h='60'; break;};
            case('team'):{h='100'; break;};
          }
          return { height:h+'px',overflow:'hidden', };
        },
        //just judge whether the li have the level of team
        avator_w:function(havelevel){
          var w,b_radius;
          switch(this.type){
            case('recent'):{
              if(havelevel){
                w='78';
                b_radius='0';
              }else{
                w='50';
                b_radius='50';
              }
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
            type:(haslevel)?'team':'people',
            uid:li_uid,
            to:uid,
            checked:true
          }
          postChange('/dealwithunread',data,function(d){
            console.log(d);
          });
        },

        //当某个messli被点击之后，打开messageframe并获得未读信息
        show_messageFrame:function(event,li_uid,haslevel){
          main.moreinfoSeen = false;
          var e = $(event.target);
          var unread_badge = e.find('.badge')[0]||e.parents('li').find('.name span.badge')[0];
          var unreadNumber = parseInt(unread_badge.innerText);
          this.subUnread(unread_badge,uid,li_uid,haslevel);
          //this.type is the prop
          main.messtype=this.type;
          if(haslevel){ main.messtype='team'; }
          main.isteam = (main.messtype==='team')?true:false;
          main.messageframeSeen=true;
          $('#messageframe_cont').html('');
          main.nameOfmessageframe = e.find('.name').text()||e.parent().find('.name').text()||e.parent().parent().find('.name').text();
          main.to = li_uid;
          main.getUnreadMess(main.to,unreadNumber,main.messtype);
        },
      },
    },
  },

    
  el:'#main',
  data:{
    punReadNumber:punReadNumber,
    tunReadNumber:tunReadNumber,
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
    to:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    isMessContentSeen:{
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
        check_uid:this.to
      }
      postChange("/getMoreinfo",data,function(d){
        console.log(d);
        console.log(main.messInfo);
        main.messInfo = d;
      });
      this.moreinfoSeen=true;
      console.log("CheckMoreinfo");
    },
    getMoreMess:function(){
      console.log('getMoreMess');
      $('#messageframe_cont').append();
    },
    addUnReadInDB:function(msg_type,msg_uid,msg_to){
      console.log('AddUnreadInDB');
      var data = {
        type:msg_type,
        uid:msg_uid,
        to:msg_to,
        checked:false
      };
      postChange('/dealwithunread',data,function(d){
        console.log(d);
      });
    },
    addUnReadNumber:function(msg){
      console.log("Add UnReadNumber");
      var msg_type = (msg.type==='team')?'team':'people';
      console.log('Msg type is '+msg_type);
      var msg_uid = msg.uid;
      var msg_to = msg.to;
      var recent_lis = $('ul#recent').find('li');
      for(var i=0;i<recent_lis.length;i++){
        //循环获得每个li的消息类型,uid,未读数量
        var li_type = recent_lis.eq(i).find('.info .li_type span').text();
        var li_uid = recent_lis.eq(i).find('.info span.uid').text();
        var unread_badge = recent_lis.eq(i).find('.name span.badge')[0];
        console.log(msg_type===li_type && msg_uid===li_uid);
        if(msg_type===li_type && msg_uid===li_uid){
        //如果消息类型和uid都符合条件的话
          // console.log('Your uid: '+uid);
          // console.log('Li uid: '+li_uid);
          console.log('Unread badge text is: '+unread_badge.innerText);

          if(!unread_badge.innerText){
            console.log('Make unread_badge text 0 and show it');
            unread_badge.innerText = 0;
            unread_badge.style.display = 'inline-block';
          }else{
            console.log('Can not do anything with unread_badge!');
          }
          unread_badge.innerText = parseInt(unread_badge.innerText)+1; 
          break;
        }
      }
      this.addUnReadInDB(msg_type,msg_uid,msg_to);
    }, 
    createMessDiv:function(msg){
      console.log("The message to be created is about:");
      console.log(msg);
      var f;

      if(msg.type==='team'){
        f=(msg.from===uid)?"style='float:right'":"style='float:left'";
      }else{
        f=(msg.uid===uid)?"style='float:right'":"style='float:left'";
      }
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
    addRecentLi:function(info){
      console.log('AddRecentLi Base On Info:');
      console.log(info);
      var con = {
        h:'55px',
        borderR:'50%',
        avator_w:'50px',
        type:'people'
      }
      if(info.level){
        con.h = '80px';
        con.borderR = '0%';
        con.avator_w = '70px';
        con.type='team';
      };
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
        console.log('This badge number is :'+ unreadNumber);
        unread_badge.innerText = '';
        unread_badge.style.display = 'none';
        main.moreinfoSeen=false;
        main.messtype='recent';
        main.messageframeSeen=true;
        main.isteam = false;
        main.nameOfmessageframe = $(this).find('.name').text();
        main.to = $(this).find('.uid').text();
        main.getUnreadMess(main.to,unreadNumber,'recent');
        document.getElementById('messageframe_cont').innerHTML = '';
        // $('#messageframe_cont').html('');
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
        console.log("Get unread messages:");
        // for(var i=0;i<d.length;i++){
        //   console.log(d[i]);
        // }
        console.log('Unread number is:'+d.length);
        for(let i=0;i<d.length;i++){
          console.log(i);
          main.createMessDiv(d[i]);
        }
      })      
    },
    judgeMess:function(msg){
      if(msg.type===main.messtype&&(msg.uid===main.to||msg.uid===uid||msg.to===main.to)){ 
        console.log("Add messli in messageframe");
        this.createMessDiv(msg);
      }else{
        this.addUnReadNumber(msg);
      }
      var exist;
      console.log('Exist:???');
      console.log('msg.to: '+msg.to);
      console.log('msg.uid: '+msg.uid);
      console.log('msg.from: '+msg.from);
      console.log('uid: '+uid);
      if(msg.type==='team'){
        console.log("The msg.type is team");
        //check whether the recent.team exist;
        for(let i of loginlist['recent'].team){
          if(i===msg.uid||i===msg.to){
            console.log('Presently the loginlist.team is :');
            console.log(loginlist['recent'].team);
            exist = true;
            break;
          }
        }
      }else{
        //check whether the recent.people exist;
        for(let i of loginlist['recent'].people){
          if(i===msg.uid||i===msg.to){
          // if(i===msg.uid){
            console.log("Presently the loginlist.people is :");
            console.log(loginlist['recent'].people);
            exist = true; 
            break; 
          }
        }
      }
      if(!exist){
        console.log("The recent li is not exist:");

        if(msg.uid===uid){
          console.log('This msg is from yourself!');

          //if who send msg and who receive msg is the same;  
          var d = { 
            uid:msg.to,
            type:msg.type
          };

          postChange('/justGetInfo',d,function(data){
            if(msg.type==='team'){
              loginlist['recent'].team.push(msg.uid);
            }else{
              loginlist['recent'].people.push(msg.to);
            }
            main.addRecentLi(data);
            var recentFirstLiUnreadnumber = $('ul#recent').find('li').eq(0).find('.name span.badge')[0];
            recentFirstLiUnreadnumber.innerText = '';
            recentFirstLiUnreadnumber.style.display = 'none';
          })
        }else{
          console.log('This msg is from others');
          if(msg.type==='team'){
            loginlist['recent'].team.push(msg.uid);
          }else{
            loginlist['recent'].people.push(msg.uid);
          }
          this.addRecentLi(msg);
        }

      }
    },
    messageCome:function(msg){
      console.log('The msg is:');
      console.log(msg);
      this.judgeMess(msg);
    },
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
      this.messtype='';
      $('#messageframe_cont').html('');
      $('#messageframe_input').val('');
    },

    hideDomore:function(){
      $('#domore').css('width','0px');
      $('#domore').__proto__.judge = false;
    },
    resetOption:function(){
      $('.sOption').css('background','#FCFEF4').css('color','#333');
      this.isMessContentSeen.recent=false;
      this.isMessContentSeen.star=false;
      this.isMessContentSeen.team=false;
    },
    contentSeen:function(event,type){
      this.resetOption();
      var e = $(event.target);
      e.css('color','#70C1B9').css('background','transparent');
      this.isMessContentSeen[type]=true;
    },
  },
});

socket.on(uid,function(J_msg){
  var msg = JSON.parse(J_msg);
  main.messageCome(msg);
})