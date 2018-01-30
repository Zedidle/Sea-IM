var main = new Vue({
  components:{
    'domore-part':DomorePartComponent,
    'user-info':UserInfoComponent,
    'search-content':SearchContentComponent,
    'mess-lis':MessLisComponent
  },
  el:'#main',
  data:{

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
    
    userInfo:UserInfo,
    recentInfo:RecentInfo,
    starInfo:StarInfo,
    teamInfo:TeamInfo
  },


  computed:{
    isTeam:function(){
      return this.messtype === 'team';
    },
    moreInfoTeamMemberNumber:function(){
      // return this.moreInfo.members.length;
      return 50;
    }
  },

  methods:vMethods()
});

//listen the port of the user,
socket.on(UID,function(J_msg){
  main.messageCome(JSON.parse(J_msg)); 
});

console.log(UID);

//every 10 seconds to send a heartbeat package , keep on line;
setInterval(function(){
  socket.emit('heartbeat',UID); 
},10000);
