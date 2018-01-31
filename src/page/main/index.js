var main = new Vue({
  components:{
    'domore-part':DomorePartComponent,
    'user-info':UserInfoComponent,
    'search-content':SearchContentComponent,
    'mess-lis':MessLisComponent
  },
  el:'#main',

  template:`
<div
  class='container' 
  id='main'
>

  <div id="content" >
    <domore-part></domore-part>


    <div id="checkMess" >
      <user-info
        v-bind:info='userInfo'
      ></user-info>
      <search-content></search-content>
      <div id="messOption" v-on:click='hideDomore'>
        <div 
          v-on:click="listSeen($event,'recent')" 
          id='recentOption' 
          class='sOption'
        >
          <span 
            class="glyphicon glyphicon-pencil" 
            aria-hidden="true"
          ></span>
        </div>
        <div 
          v-on:click="listSeen($event,'star')" 
          id='starOption' 
          class='sOption'
        >
          <span 
            class="glyphicon glyphicon-star" 
            aria-hidden="true"
          ></span>
        </div>
        <div 
          v-on:click="listSeen($event,'team')" 
          id='teamOption'
          class='sOption'
          >
          <span
            class="glyphicon glyphicon-fire"
            aria-hidden="true"
          ></span>
        </div>
      </div>
      <div
        id="messContent"
        v-on:click='hideDomore'
      >
        <div
          v-show="messShowType === 'recent'"
          id="recentContent"
          class='sContent'
        >
          <mess-lis 
            type='recent'
            v-bind:info = 'recentInfo'
          ></mess-lis>
        </div>
        <div
          v-show="messShowType === 'star'"
          id="starContent"
          class='sContent'
        >
          <mess-lis
            type='star'
            v-bind:info = 'starInfo'
          ></mess-lis>
        </div>
        <div
          v-show="messShowType === 'team'"
          id="teamContent"
          class='sContent'
        >
          <mess-lis
            type = 'team'
            v-bind:info = 'teamInfo'
          ></mess-lis>
        </div>
      </div>
    </div>
  </div>

  <div
    class='logOffJudgeHide'
    v-bind:class='{logOffJudgeShow:isWantToLogOff}'
  >
        <div class='title'>
          确认注销吗？
        </div>

        <div
          id='ensureLogOff-btn'
          v-on:click = 'ensureLogOff'
        >确认</div>
        <div
          id='cancelLogOff-btn'
          v-on:click = 'cancelLogOff'
        >取消</div>

    </div>
</div>

<footer
    style='position:fixed;
        height:10px;
        display:block;
        width:100%;
        bottom:2%;   
        text-align:center;'
>
<ul
    style='list-style: none;padding:0;margin:0;'
>
    <li>@SeaNet</li>
</ul>
</footer>


<script src='vue/vue.js'></script>
<script src='jquery/jquery.min.js'></script>
<script src='bootstrap/js/bootstrap.min.js'></script>
<script src='js/zhelp.js'></script>
<script>
  //var UID = localStorage.getItem('UID');
  var UID = sessionStorage.getItem('UID');
    var UserEnsure = {
    uid:UID
  };

    console.log(UID);

    if(!UID){
        localStorage.setItem('UID','wait');
        sessionStorage.setItem('UID','wait');
        window.location.href = '/';
    }

</script>



<script src="/socket.io/socket.io.js"></script>
<script>var socket = io();</script>

<script>



/*声音资源*/
var LoginSound = new Audio('voice/successLogin.wav');
var TeamMessageCome = new Audio('voice/tmessageCome.wav');
var PersonMessageCome = new Audio('voice/pmessageCome.wav');

LoginSound.play();

var UserInfo = JSON.parse(jsonKeep("<%=user_info%>"));
var Loginlist = JSON.parse(jsonKeep('<%=loginlist%>'));
var PunRead = JSON.parse(jsonKeep('<%=punRead%>'));
var TunRead = JSON.parse(jsonKeep('<%=tunRead%>'));
var RecentInfo = JSON.parse(jsonKeep('<%=recentinfo%>'));
var StarInfo = JSON.parse(jsonKeep('<%=starinfo%>'));
var TeamInfo = JSON.parse(jsonKeep('<%=teaminfo%>'));


// console.log('userInfo:');
// console.log(UserInfo);

// console.log('loginlist:');
// console.log(Loginlist);

// console.log('recentInfo:');
// console.log(RecentInfo);
// console.log('starInfo:');
// console.log(StarInfo);
// console.log('teamInfo:');
// console.log(TeamInfo);


// for(var i of RecentInfo){
  var isTeam = Boolean(RecentInfo.level);
  var uid = i.uid;
  i.unread = (isTeam)?TunRead[uid]:PunRead[uid];    
}

for(var i of StarInfo){
  i.unread = PunRead[i.uid];
}

for(var i of TeamInfo){
  i.unread = TunRead[i.uid];
}


</script>

<script src='js/main-help.js'></script>
<script src='js/main-domorepart.js'></script>
<script src='js/main-userinfo.js'></script>
<script src='js/main-search.js'></script>
<script src='js/main-messli.js'></script>
<script src='js/main-messageframe.js'></script>
<script src='js/main-methods.js'></script>
<script src='js/main-content.js'></script>




<script src='js/page/buildteam/buildteam.js'></script>


<script src='vue/vue-router.js'></script>
<script>
  const router = new VueRouter({
    routes: [
      // 动态路径参数 以冒号开头
      { path: '/buildteam', component: User }
    ]
  })
</script>


</body>
</html>

  `,



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
