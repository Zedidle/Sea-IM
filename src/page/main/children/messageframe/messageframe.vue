<template>
<div
  v-show='messageframeSeen'
  class='messageframe'
>
  <div class='messageframe-top'>
    <div
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
  >Get More Message
  </div>

  <div
    id='messageframe-cont'
    class='messageframe-cont'
  ></div>

  <expression></expression>

  <div class='messageframe-say'>
    <button
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
    ]),
  },
  methods:{
    ...mapMutations([
      'toggleDomore',
    ]),

    //when the mess come, if messageFrame is opning, check the messtype and messto, 
    //if satisfy the condition, it will run this function to show the message.
    //插入新消息到消息内容框
    //isTop判断是否要上插并滚动到最顶
    createMessDiv:function(msg, isTop){

      if(!msg){
        this.noMoreMessage();
        return false;
      }

      //根据类型和消息来源判断消息框浮动方向
      var f = judgeTypeforFloatDirection(msg, UID);
      console.log(msg);
      
      //获取消息内容框对象
      var cont = $('#messageframe-cont')[0];
        
      //转翻译表情信息
      var msgContent = main.expressionsParse(msg.content);

      if(isTop){
        $(cont).prepend(vCreateMessDiv(msg, f, msgContent));
        cont.scrollTop = 0; 
      }else{
        
        //添加消息到内容框
        $(cont).append(vCreateMessDiv(msg, f, msgContent));
        
        //清空输入框
        $('#messageframe-input')[0].value = '';
        
        //置顶
        cont.scrollTop = cont.scrollHeight;
      }

    },
        
    //发送消息
    sendMessage:function(){
      var v = document.getElementById('messageframe-input').value.trim();
      if(v.length){
        var msg = {
          time:mTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:UID
        };
        socket.emit('chat', JSON.stringify(msg));
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

    messageframeClose:function(){
      this.messageframeSeen=false;
      this.teamMembersSeen=false;
      this.messtype='';
      this.messto='';

      $('.messageframe')[0].style.height = '0%';
      $('#messageframe-cont')[0].innerHTML = '';
      $('#messageframe-input')[0].value = '';
    },
    
    deleteTheRecentChat:function(){
      var data = {
        uid:UID,
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
        receiveUid:UID,
        fromUid:main.messto,
        type:main.messtype
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

    //when user receive any message, run this function;
    messageCome:function(msg){

      console.log(msg);
      if((msg.uid===main.messto) && (msg.type===main.messtype||
          msg.type!=='team' && main.messtype==='star')||
          msg.uid===UID && msg.type!=='team'){
          
          this.createMessDiv(msg, false);
          console.log(1);

        if(msg.uid===uid&&msg.type==='team'&&main.messto!==msg.uid){
          this.addUnRead(msg);
          console.log(2);
        }


      }else{

        if(msg.type==='team'){
          TeamMessageCome.play();
        }else{
          PersonMessageCome.play();
        }

          console.log(3);
        this.addUnRead(msg);
      }

      //判断是否存在于最近联系
      var existInRecent = false;

      if(msg.type==='team'){
        //check whether the recent_team exist;
        var lrt = Loginlist.recent_team;
        for(i=0;i<lrt.length;i++){
          if(lrt[i]===msg.uid||lrt[i]===msg.to){
            existInRecent = true;
            break;
          }
        }

      }else{

        //check whether the recent_people exist;
        var lrp = Loginlist.recent_people;
        for(i=0;i<lrp.length;i++){
          if(lrp[i]===msg.uid||lrp[i]===msg.to){
            existInRecent = true;
            break;
          }
        }
      }


      if(!existInRecent){
        console.log(4);
        if(msg.uid===UID){
          //who send msg and who receive msg is the same;

          //无论如何都要读取对方消息
          var data = {  
            uid:msg.to, 
            type:msg.type
          };

          $.get('/getInfo',data,function(info){
            if(msg.type==='team'){
              Loginlist.recent_team.push(msg.uid);
            }else{
              Loginlist.recent_people.push(msg.to);
            }

            info.unread = 0;
            main.addRecentLi(info);
          
          });

        }else{
          if(msg.type==='team'){
            Loginlist.recent_team.push(msg.uid);
          }else{
            Loginlist.recent_people.push(msg.uid);
          }
          msg.unread = 1;
          this.addRecentLi(msg);
        }
      }
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
  .getMoreMessageOnFrame-btn {
    background: rgba(255,255,255,0.8);
    color:#555;
    width: 15rem;
    text-align: center;
    cursor:pointer;
    padding:0 0.5em 0 0.5em;
    box-shadow: 0 0 2px #999;
    border:1px solid #90C1C9;
    position: absolute;
    top:45px;
    left:40%;
    z-index:1000000;
    &:hover{
      padding:0 2em 0 2em;
      box-shadow: 0 0 10px #999;
      font-size:10px;
    }
    @media(max-width:420px){
      left:27%;
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
    .messli{
      padding:0.2em;
      margin-bottom:0.4em;
      width:100%;
      transform:translateY(-20%);
      .avator{
        width:60px;
        padding-top: 0.2em;
        margin:0.2em;
      }
      .info{
        max-width: 500px;
        @media(max-width:600px){ 
          max-width:300px; 
        }
        @media(max-width:400px){ 
          max-width:200px; 
        }
        div{
          width:100%;
          .name{
            margin-right: 0.5em;
            font-size: 0.9em; 
            display: inline-block;
          }
        }
        .content{
          margin: 0.2em 0.4em 0 0;
          border:1px solid #aaa;
          padding:0.2em;
          box-shadow: 1px 1px 2px #999;
          width:100%;
          font-size:1.2em;
          .expression-chatting{
            width:30px;
            height:30px;
            display: inline-block;
            
          }
        }
      }
    }
  }
  .messageframe-expression{
    background:rgba(255,255,255,0.5);
    width:auto;
    height:auto;
    position:absolute;
    bottom:40px;
    z-index:100000;
    div{
      cursor:pointer;
      width: 30px;
      height: 30px;
      margin:5px;
      float: left;
      display: inline-block;
      &:hover{
        background:@seaBlue;
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