<template>
  <div
    id='main'
    v-show='isLogin'
    @load = 'listen'
  >

    <transition name='fadeY-10'>
      <u-info></u-info>
    </transition>
    <transition name='fadeY-10'>
      <messlist></messlist>  
    </transition>  





    <transition name='fadeY-10'>
      <logoff></logoff>  
    </transition>  
    <transition name='fadeY-10'>
      <domore></domore>
    </transition>
    
    <transition name='fadeY-10'>
      <messageframe></messageframe>
    </transition>

    <transition name='fadeY-10'>
      <!-- <people></people> -->
    </transition>

    <transition name='fadeY-10'>
      <!-- <team></team> -->
    </transition>

    <router-view></router-view>
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
    // methods:vMethods()
    methods:{
      ...mapMutations([

      ]),

      //由于由browserSync代理，所以当前通讯端口也会发向3000
      listen(){
        var socket = io();
    
        console.log(this.UID);

        //listen the port of the user,
        socket.on(this.UID,function(J_msg){
          main.messageCome(JSON.parse(J_msg)); 
        });

        //every 10 seconds to send a heartbeat package, keep online;
        let vm = this;
        setInterval(function(){
          socket.emit('heartbeat',vm.UID);
          console.log('heartbeat!')
        },10000);
      },

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

        for(let i of this.starInfo){
          if(i.uid === uid){
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
    border:2px solid #459;
    box-shadow: 0 0 3px #999;
    background:rgba(255,255,255,0.5);

    @media(max-width: 768px){
      top:0%;
      left:0%;
      width:100%;
      height:100%;
    }
  }
/*
.container{
    border:3px solid @deepBlue;
  background-color:@lightGray;
  padding:0;
  width: auto;
  @media (max-width:450px){
    width:100%;
  }

  #content{
    display: inline-block;
    height:600px;

    #checkMess{
      overflow-x: hidden;
      overflow-y: scroll;
      height:100%;
      width:320px;
      display: inline-block;
      float: left;
      @media (max-width:450px){
        height:100%;
        width:100%;
      }
      
    #messOption{
      position: relative;
      top: 0px;
      left: 0px;
      height: 4.4rem;
      width: 100%;
      border-top:2px solid @seaBlue;
      box-shadow: 0 0 5px #999;
      @messOptionWidth:33.3%;

      .sOption{
        text-align: center;
        position: absolute;
        width:@messOptionWidth;
        height:99%;
        font-size:18px;
        padding:10px;
        cursor:pointer;
        background-color:@lightSeaBlue;
        color:#fff;
        &:hover{
          background-color:@lightBlue;
        }
        &:first-child{
          color:@seaBlue;
        }
      }
      #recentOption{
        left:@messOptionWidth*0;
      }
      #starOption{
        left:@messOptionWidth*1;
      }
      #teamOption{
        left:@messOptionWidth*2;
      }
    }
    #messContent{
      position: relative;
      display: inline-block;
      height:560px;
      width:100%;
      .sContent{
        height:100%;
        width:100%;
        ul{
          li{
            text-decoration: none;
            list-style: none;
            cursor: pointer;
            padding-left: 0.3em;
            &:hover{
              box-shadow: 0 0 5px #999;
            }
            .info{
              display: inline-block;
              float: left;
              width:60%;
              height:100%;
              .name{
                font-size: 1.1em;
                width: 100%;
                height:35%;
                .badge{
                  background: red;
                }
              }
              .li_type{
                .none;
              }
              .uid{display: none;}
              .introduce{
                font-size:12px;
                line-height: 14px;
                display: block;
                height:65%;
                color:#777;
              } 
            }
            .avator{
              display: inline-block;
              float: right;
              overflow: hidden;
              margin-top: 0.2em;
              height:95%;
              img{
                width:100%;
                height:100%;
              }
            }
          }
        }
      }
    }
  }
}*/

</style>




