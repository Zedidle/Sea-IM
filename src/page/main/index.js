var Main = new Vue({
  components:{
    'domore-part':Domore,
    'user-info':UserInfo,
    'search-content':Search,
    'mess-lis':MessList
  },
  

  template:`
<body>
  <div
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



  <script>
    /*声音资源*/


    var UserInfo = JSON.parse(jsonKeep("<%=user_info%>"));
    var Loginlist = JSON.parse(jsonKeep('<%=loginlist%>'));
    var PunRead = JSON.parse(jsonKeep('<%=punRead%>'));
    var TunRead = JSON.parse(jsonKeep('<%=tunRead%>'));
    var RecentInfo = JSON.parse(jsonKeep('<%=recentinfo%>'));
    var StarInfo = JSON.parse(jsonKeep('<%=starinfo%>'));
    var TeamInfo = JSON.parse(jsonKeep('<%=teaminfo%>'));

    for(var i of RecentInfo){
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


  <script>
  
    var socket = io();
    
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

    //listen the port of the user,
    socket.on(UID,function(J_msg){
      main.messageCome(JSON.parse(J_msg)); 
    });

    //every 10 seconds to send a heartbeat package , keep on line;
    setInterval(function(){
      socket.emit('heartbeat',UID);
    },10000);
    
  </script>

</body>
`
,
  methods:vMethods()
});


