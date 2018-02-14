<template>
  <div
    id='main'
    v-show='isLogin'
  >

    <u-info></u-info>
    <messlist></messlist>  
    <logoff></logoff>  
    <domore></domore>
    <messageframe></messageframe>
    <people></people>
    <team></team>

  </div>


</template>

  <script>
  import {mapState, mapMutations} from 'vuex';
  import logoff from './children/logoff/logoff.vue';
  import uInfo from './children/userinfo/userinfo.vue';
  import domore from './children/domore/domore.vue';
  import messlist from './children/messlist/messlist.vue';
  import messageframe from './children/messageframe/messageframe.vue';
  import people from './children/people/people.vue';
  import team from './children/team/team.vue';



  export default {
    components:{
      logoff,
      uInfo,
      domore,
      messlist,
      messageframe,
      people,
      team,

    },
    data(){
      return{

      }
    },
    computed:{
      ...mapState([
        'UID',
        'userInfo',
        'isLogin'
      ]),

    },
    created(){
      console.log(this.UID + 'LOGIN');
      //由于由browserSync代理，所以当前通讯端口也会发向3000
      //every 10 seconds to send a heartbeat package, keep online;
      let vm = this;
      setInterval(function(){
        socket.emit('heartbeat',vm.UID);
        console.log('heartbeat!')
      },10000);
    },
    // methods:vMethods()
    methods:{
      ...mapMutations([

      ]),



    listSeen:function(event,type){
      $('.sOption>span').css('color','#fff');
      var target = event.target.querySelector('span')||event.target;
      $(target).css('color','#60DDFF');
      this.messShowType = type;
    },

    //参数bool判断是否需要增加对应的未读数量
    dealUnread:function(uid, bool=false){
      if(this.isTeam){
        for(let i of this.teamInfo){
          if(i.uid === uid){
            if(bool){
              i.unread++;
            }else{
              i.unread = 0;
            }
            break;
          }
        }
      }else{
        for(let i of this.recentInfo){
          if(i.uid === uid && i.type !=='team'){
            if(bool){
              i.unread++;
            }else{
              i.unread = 0;
            }
            break;
          }
        }
      }
    },

    }
  }
    
  </script>

});


<style lang='less' scoped>
@import '../../../configs/config.less';
  #main{
    position:absolute;
    top:5%;
    left:5%;
    width:300px;
    height:564px;
    border:1px solid #7CC;
    box-shadow: 0 0 15px #999;
    background:rgba(255,255,255,0.9);

    @media(max-width: 768px){
      top:0%;
      left:0%;
      width:100%;
      height:100%;
    }
  }
</style>

