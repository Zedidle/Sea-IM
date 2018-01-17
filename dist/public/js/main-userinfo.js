var UserInfo = {
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