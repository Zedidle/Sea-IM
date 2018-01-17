var main = new Vue({
  components:{
    'domore-part':DomorePart,
    'user-info':UserInfo,
    'search-content':SearchContent,
    'mess-lis':MessLis
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
    messShowType:'recent',
    recentInfo:recentInfo,
    starInfo:starInfo,
    teamInfo:teamInfo
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