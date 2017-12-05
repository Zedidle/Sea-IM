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

        $('#search-star').click(function(){
          var stars = loginlist.star;
          var isStar = false;
          var data = { 
            sid:searchComponent.searchId,
            uid:uid
          };
          if(stars.length){
            for(let i of stars){
              if(i===data.sid){ isStar = true; break; }
            }
          }
          if(isStar){
            $('#search-person').prepend("<li class='alert alert-success' role='alert'>已经标记过！</li>");
          }else{
            var J_data = JSON.stringify(data);
            postChange('/star',data,function(data_back){
              v_addThePeopleInStar(data_back);
              loginlist.star.push(data.sid);
              $('#search-person').prepend("<li class='alert alert-success' role='alert'>成功标记该用户!</li>");
            })
          }
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
  },

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