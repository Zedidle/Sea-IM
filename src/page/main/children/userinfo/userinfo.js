var UserInfo = {
  props:{
    info:Object
  },
  template:
    `<div
      class='user-wrap'
    >
      <img
        id='user-avator'
        v-bind:src='info.headImg'
      >
    
      <div
        id='user-intro'
        v-bind:class='{userinfo_intro:true}'
      >
        <div id='user-nickname'>{{info.name}}</div>
        
        <div
          id='user-introduce'
        >{{info.introduce}}
        </div>
      </div>

      <div
        id='user-set'
        v-on:click='toggleDomore'
      >
        <span class='glyphicon glyphicon-list' aria-hidden='true'></span>
      </div>
    
    </div>`,
  data:function(){
    return {
    };
  },
  methods:{
    toggleDomore:function(){
      $('#domore')[0].style.width = (main.isDomore?'0':'70')+'px'; 
      main.isDomore = !main.isDomore;
    },
  }
};