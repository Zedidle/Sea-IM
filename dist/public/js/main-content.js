
var domorePart = {
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
    return {};
  },
  methods:{
    logOff:function(){
      if(confirm('确认注销？')){ 
        zPost('/logOff',userEnsure);
      }
    },
    getPersonInfo:function(){
      zPost('/people',userEnsure);
    },
    getTeamsInfo:function(){
      zPost('/myteam',userEnsure);
    },
    toBuildATeam:function(){
      zPost('/DealWithTeam',userEnsure);
    },
  }
};

var userInfo = {
  props:['user_info'],
  template:
    `<div v-bind:class='{userinfo_wrap:true}'>
      <div v-bind:class='{userinfo_avator:true}'>
        <img v-bind:class='{userinfo_avator_img:true}' v-bind:src='info.headImg'>
      </div>
      <div id='intro' v-bind:class='{userinfo_intro:true}'>
        <div id='name'>
          <div id='nick_name'>{{info.name}}</div>
        </div>
        <div id='introduce' v-bind:class='{userinfo_introduce:true}'>{{info.introduce}}</div>
      </div>
      <div id='set' v-bind:class='{userinfo_set:true}' v-on:click='toggleDomore' >
        <span class='glyphicon glyphicon-list' aria-hidden='true'></span>
      </div>
    </div>`,
  data:function(){
    return {
      info:JSON.parse(jsonKeep(this.user_info))
    };
  },
  methods:{
    toggleDomore:function(){
      $('#domore')[0].style.width = (main.isDomore?'0':'70')+'px'; 
      main.isDomore = !main.isDomore;
    },
  }
};




var searchContent = {
  template:
    `<div id='search-content' >
      <div id='search' v-on:keyup.13='searchSubmit'>
      <button id='sub' v-on:click='searchSubmit'>
        <span class='glyphicon glyphicon-search' aria-hidden='true'></span>
      </button>
      <input
        v-model.trim='searchId'
        id='search_uid'
        name='search_uid'
        placeholder='请输入团队或用户的ID'
      >
      <div v-bind:class='{search_close:true}' v-on:click='closeCheckInfo'>
        <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
      </div>
    </div>
  </div>`,
  data:function(){
    return {
      searchId:''
    };
  },
  methods:{
    removeSearchInfo:function(){ 
      if(document.getElementById('search-info')){
        $('#search-info').remove();
      }
    },
    closeCheckInfo:function(){
      $('search_uid')[0].value = '';
      $('search_uid')[0].style.width = '78%';
      this.removeSearchInfo();
    },
    searchSubmit:function(){ 
      this.removeSearchInfo(); 
      this.getSearchResponse(); 
    },
    getSearchResponse:function(){
      this.searchId = document.getElementById('search_uid').value.trim(); 
      if(!this.searchId||this.searchId===uid){
        return false;
      }
      $('search_uid')[0].style.width='70%';
      var t = this;
      $.post("/search",{ uid:this.searchId },function(d){
        var team = d.team;
        var person = d.person;
        $('#search-content').append("<div id='search-info'></div>");
        if(team){
          t.createSearchTeamInfo(team);
          t.setSearchTeamFunctions();
        }
        if(person){
          t.createSearchPersonInfo(person);
          t.setSearchPersonFunctions();
        }
        t.addSearchTips(team,person);
      });
    },
    createSearchTeamInfo:function(t){
      $('#search-info').append(v_createSearchTeamInfo_template(t));
    },
    setSearchTeamFunctions:function(){
      var t = this;
      $('#join').click(function(){
        var data = {
          uid:uid,
          tid:t.searchId
        };
        $.post('/join_judge',data,function(judge){
          if(judge==='ok'){ 
            zPost('/join',data); 
          }else{
            $('#search-team').append("<li class='alert alert-info'>"+judge+"</li>");
          }
        });
      });
    },

    createSearchPersonInfo:function(p){
      $('#search-info').append(v_createSearchPersonInfo_template(p));
    },

    setSearchPersonFunctions:function(){
      var searchComponent = this;
      $('#send').click(function(){
        console.log('setSearchPersonFunctions TIP');
        main.messageframeSeen = true;
        main.messtype = 'recent';
        main.messto = searchComponent.searchId;
        main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();
      });

      $('#search-star').click(function(){
        var stars = loginlist.star;
        var isStar = false;
        var data = { 
          sid:searchComponent.searchId,
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
          $('#search-person').prepend(
            "<li class='alert alert-success' role='alert'>已经标记过！</li>"
          );
        }else{
          $.post('/star',data,function(data_back){
            v_addThePeopleInStar(data_back);
            loginlist.star.push(data.sid);
            $('#search-person').prepend(
              "<li class='alert alert-success' role='alert'>成功标记该用户!</li>"
            );
          });
        }
      });
    },

    addSearchTips:function(teamExist, personExist){
      if(!teamExist){
        $('#search-info').append(
          "<div class='alert alert-warning' role='alert'>没有团队</div>"
        );
      }
      if(!personExist){
        $('#search-info').append(
          "<div class='alert alert-warning' role='alert'>找不到用户</div>"
        );
      }
    }
  }
};

var messLis = {
  props:['type', 'info', 'punread', 'tunread'],
  template:
    "<ul v-bind:id='type'>"+
      "<li v-for='i in _info' v-on:click='show_messageFrame($event,i.uid,i.level)' :style='li_height(i.level)'>"+
        "<div class='info'>"+
          "<div class='name'>{{i.name}} "+
            "<span class='badge' v-if=!i.level>{{punR[i.uid]?punR[i.uid]:''}}</span> "+
            "<span class='badge' v-if=i.level>{{tunR[i.uid]?tunR[i.uid]:''}}</span>"+
          "</div>"+
          "<div class='li_type'>"+
            "<span v-if=i.level>team</span>"+
            "<span v-else>people</span>"+
          "</div>"+
          "<span class='uid' >{{i.uid}}</span>"+
          "<div class='introduce'>{{i.introduce}}</div>"+
        "</div>"+
        "<div class='avator' :style='avator_w(i.level)'><img :src=i.headImg></div>"+
      "</li>"+
    "</ul>",
  computed:{
    punR:function(){
      return JSON.parse(jsonKeep(this.punread));
    },
    tunR:function(){
      return JSON.parse(jsonKeep(this.tunread));
    },
    _info:function(){
      return JSON.parse(jsonKeep(this.info));
    }
  },
  methods:{
    li_height:function(havelevel){
      var h = this.type==='recent'?
              havelevel?'80':'50':
              this.type==='star'?'60':'100';
      return {
        height:h+'px',
        overflow:'hidden'
      };
    },
    avator_w:function(havelevel){
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

    subUnread:function(unread_badge,uid,li_uid,haslevel){
      unread_badge.innerText = '';
      unread_badge.style.display = 'none';
      var data = {
        type:haslevel?'team':'people',
        uid:li_uid,
        to:uid,
        checked:true
      };
      $.post('/dealwithunread',data,function(){
      });
    },
    //when a messli be clicked, open the messageframe and get unread messages.
    show_messageFrame:function(event,li_uid,haslevel){
      main.moreinfoSeen = false;
      var e = $(event.target);
      var unread_badge = e.find('.badge')[0]||
        e.parents('li').find('.name span.badge')[0];
      var unreadNumber = parseInt(unread_badge.innerText);
      this.subUnread(unread_badge,uid,li_uid,haslevel);
      main.messtype=this.type;
      if(haslevel){ 
        main.messtype='team'; 
      }
      main.isteam = main.messtype==='team';
      main.messageframeSeen=true;
      document.getElementById('messageframe_cont').innerHTML = '';
      main.nameOfmessageframe = e.find('.name').text()||
        e.parent().find('.name').text()||
        e.parent().parent().find('.name').text();
      main.messto = li_uid;
      main.getUnreadMess(main.messto,unreadNumber,main.messtype);
    },
  },
};



var main = new Vue({
  components:{
    'domore-part':domorePart,
    'user-info':userInfo,
    'search-content':searchContent,
    'mess-lis':messLis
  },
  el:'#main',
  data:{
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
    isDomore:false,
    isteam:false,
    moreinfoSeen:false,
    teamMembersSeen:false,
    messtype:'',
    messto:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    expressionSeen:false,
    isMessageListSeen:{
      recent:true,
      star:false,
      team:false
    },
    recentlist:[],
    starlist:[],
    teamlist:[]
  },
  methods:v_methods()
});

//listen the port of the user,
socket.on(uid,function(J_msg){
  main.messageCome(JSON.parse(J_msg)); 
});

//every 10 seconds to send a heartbeat package , keep on line;
setInterval(function(){
  socket.emit('heartbeat',uid); 
},10000);