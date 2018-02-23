<template>
<div
  v-show='messageframeSeen'
  class='messageframe'
>
  <div class='messageframe-top'>
    <div
      @click = 'closeMessageframe'
      class='messageframe-close'
    >
      <i 
      :style='iconS'
      class="icon iconfont icon-back"
      ></i>
    </div>
    
    <div>{{messname}}</div>
    
    <div
      @click='showMoreInfo'
      class='messageframe-info'
    >
    <i 
      :style='iconS'
      class="icon iconfont icon-bussinesscard"
    ></i>
    </div>
  </div>

  <div
    id="getMoreMessageOnFrame-btn"
    @click='getMoreMessage'
  >
      <i
      :style='iconS'
      class="icon iconfont icon-code"
      ></i>
  </div>
  <transition name='bounce'>
    <expression></expression>
  </transition>

  <ul
    id='messageframe-cont'
    class='messageframe-cont'
  >
    <li v-for='i in messContent'>
      <img 
        class='avator'
        :style = 'mFloat(i)'
        :src='i.headImg'
      >
      <div 
        :style = 'mFloat(i)'
        class='info'
      >
        <div :style='textAlign(i)'>
          <div class="name">{{i.name}}</div>
          <span>{{i.time}}</span>
        </div>
        <div class="content" v-html='i.content'></div>
      </div>
      <br clear='both'>
    </li>
  </ul>


  <div class='messageframe-say'>
    <button
      @click = 'toggleExpressions'
      class='messageframe-face'
    >
      <i
      :style='iconS'
      class="icon iconfont icon-smile"
      ></i>
    </button>
    <input
      id='messageframe-input'
      @keyup.enter='sendMessage'
    >
    <button
      class='messageframe-subm'
      @click='sendMessage'
    >
      <i 
      :style='iconS'
      class="icon iconfont icon-skip"
      ></i>
    </button>
  </div>
</div>

</template>



<script>

import {mapState,mapMutations} from 'vuex';
import expression from './children/expression.vue'

export default {
  data(){
    return {
      iconS:{
        fontSize:'30px',
        lineHeight:'30px',
      }
    }
  },
  
  components:{
    expression,
  },
  computed:{
    ...mapState([
      'messageframeSeen',
      'messto',
      'messname',
      'messtype',
      'moreInfo',
      'messContent',
      'UID',
      'list',
      'recentInfo',
    ]),
  },
  created(){
    console.log('messageframe created');
    let vm = this;
    socket.on(vm.UID, (m)=>{
      let msg = JSON.parse(m);
      console.log('----------socket message come---------')

      /********** IMPORTANT ***********/
      //Messages come from people or team, receive it and make the different things!
      if(
          ((msg.type==='p')&&
          ((msg.uid === vm.UID) || 
            (msg.to === vm.UID && vm.messto === msg.uid)
          )) || 
          ((msg.type==='t')&&
          ((msg.from === vm.UID) || 
            (vm.messtype==='t' && msg.uid === vm.messto)
          ))
        ){

          vm.pushMContent(msg);
          console.log('pushMContent');

      }else{
        vm.addUnread(msg);
        console.log('addUnread');
      }
      
    });
  },
  methods:{
    ...mapMutations([
      'closeMessageframe',
      'toggleExpressions',
      'pushMContent',
      'unshiftMContent',
      'getMoreMessage',
      'addNewRecentLi',
      'showMoreInfo',
    ]),


    // Because it dosen't work in vuex, as object's properties.
    addUnread(msg){

      let recentInfo = document.querySelectorAll('#list>li');
      let uid,type,unr,j;

      for(let i of recentInfo){
        uid = i.querySelector('.uid').innerText;
        type = i.querySelector('.type').innerText;
        unr = i.querySelector('.unread').innerText;
        if(uid===msg.uid && type===msg.type){
          if(unr){
            console.log('unr+=1')
            i.querySelector('.unread').innerText = parseInt(unr)+1;
          }else{
            console.log('unr=1')
            i.querySelector('.unread').innerText = 1;
          }
          i.querySelector('.unread').style.display = 'inline-block';
          j=true;
          break;
        }
      }

      if(!j){
        this.addNewRecentLi(msg);
      }

    },

    mFloat(msg){
      let f;
      if(msg.type==='t'){
        f=(msg.from===this.UID)?"right":"left";
      }else{
        f=(msg.uid===this.UID)?"right":"left";
      }
      return {
        float:f,
      };
    },
    textAlign(msg){
      let f;
      if(msg.type==='t'){
        f=(msg.from===this.UID)?"right":"left";
      }else{
        f=(msg.uid===this.UID)?"right":"left";
      }
      return {
        textAlign:f,
      };
    },

    dayTime(){
      let d = new Date();
      let h = ('0'+d.getHours()).slice(-2);
      let min = ('0'+d.getMinutes()).slice(-2);

      return h+':'+min
    },

    //发送消息
    sendMessage:function(){
      var v = document.getElementById('messageframe-input').value.trim();
      console.log('235 sendMessage');
      if(v.length){
        var msg = {
          time:this.dayTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:this.UID
        };
        socket.emit('chat', JSON.stringify(msg));
      }
      document.getElementById('messageframe-input').value = '';
    },
  }
}



</script>


<style lang='less' scoped>
  
  @import '../../../../../configs/config.less';

.messageframe{
  background-color:#FBFCFD;
  border:solid 2px @seaBlue;
  overflow: hidden;
  display: inline-block;
  position:fixed;
  z-index: 1000;
  top:35px;
  left: 400px;
  width:700px;
  height:560px;
  box-shadow: 0px 0px 5px @seaBlue;
  @media (max-width:768px){
    top: 0px; left:0px;
    width:100%;
  }
  .moreinfo{
    width: 300px;
    background-color:#FAFBFC;
    border:solid 2px #999;
    box-shadow:0 0 2px #999;
    position: absolute;
    top:45px;
    left:100px;
    z-index: 10000;
    padding:5px 10px;
    text-align: center;
    &:hover{
      box-shadow:3px 3px 5px #999;
    }

    @media(max-width:768px){
      left:5%;
      width:90%;
    }
    .moreinfo-close{
      text-align: left;
      color:@grayRed;
      height:30px;
      font-size:1.8em;
      &:hover{
        color:@lightRed;
      }
    }
    img{
      width:100px;
      height:100px;
      border:1px solid #999;
      &:hover{
        border-width:2px;
      }
    }
    .teamMembers{
      width:105%;
      ul{
        max-height:370px;
        /*overflow-y:scroll; */
        li{
          width:65px;
          height:90px;
          list-style: none;
          float: left;
          margin-right: 2px;
          img{
            width:50px;
            height:50px;
          }
          .name{
            text-align: center;
          }
        }
      }
    }
    .info{
      font-size:16px;
      color:#578C99;
      text-align: left;
      div{
        width:100%;
        margin-bottom: 5px;
        float: left;
      }
      h3{
        margin:0;
        width:30%;
        text-align: right;
        font-size:16px;
        float: left;
      }
      h4{
        padding-left:0.8em;
        padding-right: 0.8em;
        margin:0;
        width: 70%;
        text-align: left;
        font-size: 16px;
        float: left;
      }
    }
    .more{
      width:100%;
      float: left;
      text-align: center;
      .star{}
      .deleteChat{}
      .exitTeam{}
      .showMember{}
    }
  }
  #getMoreMessageOnFrame-btn{
    background: transparent;
    color:#555;
    text-align: center;
    cursor:pointer;
    padding:0 0.5em 0 0.5em;
    box-shadow: 0 0 2px #999;
    position: absolute;
    top:35px;
    left:50%;
    transform:translateX(-50%);
    z-index:1000000;
    &:hover{
      box-shadow: 0 0 5px #999;
      color:#7CC;
    }
  }
  .messageframe-top{
    display: block;
    height: 3rem;
    color: #fff;
    background-color: @seaBlue;
    @media (max-width:600px){
      display: block;
    }
    .messageframe-close{
      text-align: center;
      cursor: pointer;
      float: left;
      display:inline-block;
      background-color: @seaBlue;
      width:10%;
      height:100%;
      &:hover{
        color:@seaBlue;
        background-color: #FFF;
      }
    }
    div{
      font-size: 1.5em;
      float: left;
      text-align: center;
      width:80%;
      height:100%;
    }
    .messageframe-info{
      background-color: @seaBlue;
      text-align: center;
      line-height: 200%;
      float: right;
      cursor: pointer;
      font-size: 1.2em;
      display: inline-block;
      width:10%;
      height:100%;
      &:hover{
        color:@seaBlue;
        background-color: #FFF;
      }
      @media (max-width:600px){
        font-size: 1em;
      }
    }
  }
  #messageframe-cont{
    width:100%;
    height:90%;
    overflow-y:scroll; 
    font-size:1.2em;
    padding-top:25px;
    li{
      margin-bottom:0.4em;
      .avator{
        width:60px;
        height:60px;
        /*float:left;*/
        border-radius: 50%;
        border:1px solid #999;
      }
      .info{
        min-width:100px;
        max-width:70%;
        margin:5px;
        /*float:left;*/
        transform: translateY(-10px);
        @media(max-width:468px){ 
          max-width:220px; 
        }
        div{
          width:100%;
          padding:0 5px;
          .name{
            margin-right: 0.5em;
            font-size: 0.9em; 
            width:auto;
            display: inline-block;
          }
        }
        .content{
          margin: 0.2em 0.4em 0 0;
          padding: 0.2em;
          word-break:break-all;
          box-shadow: 0px 0px 5px #999;
          font-size: 1.2em;

        }
      }
    }
  }
  
  .messageframe-say{
    overflow: hidden;
    border:solid 2px @seaBlue;
    display: block;
    text-align: center;
    height:4rem;
    color:#fff;
    position:absolute;
    bottom:0;
    width:100%; 
    background: transparent;
    .messageframe-face{
      font-size:20px;
      text-align: center;
      color: #fff;
      border:2px solid @seaBlue;
      background-color:@seaBlue;
      display: inline-block;
      float: left;
      height:100%;
      width:10%;
      cursor: pointer;
      &:hover{
        color:@seaBlue;
        background-color:#FFF;
      }
    }
    input{
      padding-left: 0.2em;
      display: inline-block;
      float: left;
      height:100%;
      width:80%;
      font-size: 1.2em;
      color:#222;
      border:2px solid @seaBlue;
      @media (max-width:600px){
        width:75%;
      }
    }
    .messageframe-subm{
      display: inline-block;
      font-size: 20px;
      text-align: center;
      background-color: @seaBlue;
      border:2px solid @seaBlue;
      color:#FFF;
      float: left;
      height:100%;
      width:10%;
      cursor: pointer;
      &:hover{
        color:@seaBlue;
        background-color:#FFF;
      }
      @media (max-width:600px){
        width:15%;
      }
    }
  }
}
</style>