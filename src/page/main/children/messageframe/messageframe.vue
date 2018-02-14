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
      class='messageframe-info'
    >
    <i 
      :style='iconS'
      class="icon iconfont icon-bussinesscard"
    ></i>
    </div>
  </div>


  <div
    class="getMoreMessageOnFrame-btn"
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
        <div class="content">
          {{i.content}}
        </div>
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

// import z from 'zhelp';
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
    socket.on(this.UID, (m)=>{
      let msg = JSON.parse(m);
      console.log(msg);

      if(msg.type==='p'){
        //come from yourself or others
        console.log(1);
        if((msg.uid === this.UID) || 
            (msg.to === this.UID && this.messto === msg.uid)
          ){
          this.pushMContent(msg);
          let cont = document.getElementById('messageframe-input');
          cont.scrollTop = cont.scrollHeight;
        }else{
          // add unread
        console.log(2);
          for(let i of this.rencentInfo){
            if(i.uid===msg.uid && !i.level){
              i.unr++;
              break;
            }
          }
        }

      }else if(msg.type==='t'){

        // come from yourself in team
        // or come from others in team
        if((msg.from === this.UID) || 
          (this.messtype==='t' && msg.uid === this.messto)
          ){
          this.pushMContent(msg);
          let cont = document.getElementById('messageframe-input');
          cont.scrollTop = cont.scrollHeight;
        }else{
          console.log(4);
          for(let i of this.rencentInfo){
            if(i.uid===msg.uid && i.level){
              i.unr++;
              break;
            }
          }
        }
      }
      
    });
  },
  methods:{
    ...mapMutations([
      'closeMessageframe',
      'toggleExpressions',
      'pushMContent',
      'unshiftMContent',

    ]),
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


    //when the mess come, if messageFrame is opning, check the messtype and messto, 
    //if satisfy the condition, it will run this function to show the message.
    //插入新消息到消息内容框
    //isTop判断是否要上插并滚动到最顶
    createMessDiv:function(msg, toTop){

      if(!msg){
        this.noMoreMessage();
        return false;
      }

      //根据类型和消息来源判断消息框浮动方向
      var f = judgeTypeforFloatDirection(msg, this.UID);
      console.log(msg);
      
      //获取消息内容框对象
      var cont = $('#messageframe-cont')[0];
        
      //转翻译表情信息
      var msgContent = main.expressionsParse(msg.content);

      if(toTop){
        $(cont).prepend(vCreateMessDiv(msg, f, msgContent));
        //置顶
        cont.scrollTop = 0; 
      }else{
        
        $('#messageframe-input')[0].value = '';
        cont.scrollTop = cont.scrollHeight;
      }

    },
        
    

    showMembers:function(){
      main.teamMembersSeen = true;
      $.get('/showMembers',{ tid:main.messto }, function(_infos) {
        var teamMembers_ul = document.querySelector('.teamMembers>ul');
        for(var i=0;i<_infos.length;i++){
          $(teamMembers_ul).append(vTeamMembersTemplate(_infos[i]));         
        }
      });
    },

    closeTeamMembers:function(){
      document.querySelector('.teamMembers>ul').innerHTML = '';
      this.teamMembersSeen = false;
    },


    
    deleteTheRecentChat:function(){
      var data = {
        uid:this.UID,
        type:main.messtype,
        to:main.messto
      };
      $.post('/deleteRecentChat',data,function(d){
        main.removeRecentLi(data);
      });

      main.messageframeClose();
    },
    


    getMoreInfo:function(){
      console.log('2333');

      var data = {
        type:this.messtype,
        uid:this.messto
      };

      console.log('getMoreInfo');
      console.log(data);

      //无法查询团队信息,会引起系统崩溃!
      $.get("/getInfo",data,function(info){
        console.log(info);
        //这里的数据格式同后台数据库一致，可以直接绑定到Vue对应的data对象上
        main.moreInfo = info;
        console.log(main.moreInfo);
      });
      this.moreinfoSeen = true;
    },

    getMoreMessage:function(){
      //读取现有信息长度
      var skip = document.querySelectorAll('#messageframe-cont>.messli').length;
      console.log(skip);

      var data = {
        receiveUid:this.UID,
        fromUid:this.messto,
        type:this.messtype
      };

      //获取更多聊天记录
      $.post('/getMoreMessage', data, function(messages){
        
        console.log(messages);

        if(messages){
          var l = messages.length;
          for(var i=0;i<5;i++){
            //这里的做法是把与对方的聊天消息一次全部拿出来
            //再慢慢读取
            main.createMessDiv(messages[l-1-skip-i], true);
          }
        }else{
          main.noMoreMessage();
        }
      });
    },
       //没有更多聊天记录的提示
    noMoreMessage:function(){
        var getMessBtn = $('.getMoreMessageOnFrame-btn')[0];
        getMessBtn.innerText = 'No More';
        setTimeout(function(){
          getMessBtn.innerText = 'Get More Message';
        },1500);
    },


    expressionToMark(expressionMark){
          var t;
          switch(expressionMark){
            case '呵呵':t = 0; break;
            case '哈哈':t = 1; break;
            case '吐舌':t = 2; break;
            case '啊':t = 3; break;
            case '酷':t = 4; break;
            case '怒':t = 5; break;
            case '开心':t = 6; break;
            case '汗':t = 7; break;
            case '泪':t = 8; break;
            case '黑线':t = 9; break;
            case '鄙视':t = 10; break;
            case '不高兴':t = 11; break;
            case '真棒':t = 12; break;
            case '钱':t = 13; break;
            case '疑问':t = 14; break;
            case '阴险':t = 15; break;
            case '吐':t = 16; break;
            case '咦':t = 17; break;
            case '委屈':t = 18; break;
            case '花心':t = 19; break;
            case '呼':t = 20; break;
            case '笑眼':t = 21; break;
            case '冷':t = 22; break;
            case '太开心':t = 23; break;
            case '滑稽':t = 24; break;
            case '勉强':t = 25; break;
            case '狂汗':t = 26; break;
            case '乖':t = 27; break;
            case '睡觉':t = 28; break;
            case '惊哭':t = 29; break;
            case '生气':t = 30; break;
            case '惊讶':t = 31; break;
            case '喷':t = 32; break;
            case '爱心':t = 33; break;
            case '心碎':t = 34; break;
            case '玫瑰':t = 35; break;
            case '礼物':t = 36; break;
            case '彩虹':t = 37; break;
            case '星星月亮':t = 38; break;
            case '太阳':t = 39; break;
            case '钱币':t = 40; break;
            case '灯泡':t = 41; break;
            case '咖啡':t = 42; break;
            case '蛋糕':t = 43; break;
            case '音乐':t = 44; break;
            case 'haha':t = 45; break;
            case '胜利':t = 46; break;
            case '大拇指':t = 47; break;
            case '弱':t = 48; break;
            case 'ok':t = 49; break;
          }
          return t;
        }

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
  .getMoreMessageOnFrame-btn {
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
          max-width:300px; 
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
          .expression-chatting{
            width:30px;
            height:30px;
            display: inline-block;
            
          }
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