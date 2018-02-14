<template>
  <ul
    id='list'
  >
      <li
        @click='showMessageframe({uid:i.uid,name:i.name,type:i.level?"t":"p"})'
        v-for='i in recentInfo'
      >
        <span class='uid'>{{i.uid}}</span>
        <span class='type'>{{i.level?"t":"p"}}
        </span>

        <div class='info'>
          <div class='name'>
            {{i.name}}
            <span class='badge' v-show='i.unr' >{{i.unr}}</span>
          </div>

          <div class='introduce'>{{i.introduce}}</div>
        </div>

        <img :src=i.headImg>
    </li>
  </ul>

</template>


<script>
import {mapState,mapMutations} from 'vuex';


export default {

  data(){
    return {

    }
  },
  
  computed:{
    ...mapState([
      'recentInfo',
    ]),
  },
  methods:{
    ...mapMutations([
      'toggleDomore',
      'showMessageframe',
    ]),



    addUnRead:function(msg){
      var msgUid = msg.uid;

      this.dealUnread(msgUid, true);
      this.unReadAdd1InDB(msg.type, msg.uid, msg.to);
    },

    addRecentLi:function(info){
      main.recentInfo.unshift(info);

      if(main.messtype === 'team'){
        Loginlist.recent_team.unshift(info.uid);
      }else{
        Loginlist.recent_people.unshift(info.uid);
      }

    },
    removeRecentLi:function(data){
      console.log('removeRecentLi:');

      console.log(this.recentInfo[0]);

      var i;

      for(i=0;i<this.recentInfo.length;i++){
        if(this.recentInfo[i].uid=== data.to &&
           (this.recentInfo[i].type === 'people'||
            this.recentInfo[i].type === 'recent')){
          this.recentInfo.splice(i,1);
          break;
        }
      }

      //同时完成Loginlist的更改
      // if(data.type ==='team'){
      //   for(i=0;i<Loginlist.recent_team.length;i++){
      //     if(Loginlist.recent_team[i] === data.to){
      //       Loginlist.recent_team.splice(i,1);
      //       break;
      //     }
      //   }
      // }else{
      //   for(i=0;i<list.recent_people.length;i++){
      //     if(Loginlist.recent_people[i] === data.to){
      //       Loginlist.recent_people.splice(i,1);
      //       break;
      //     }
      //   }
      // }
    },
    unReadAdd1InDB:function(msgType,msgUid,msgTo){
      var data = {
        type:msgType,
        uid:msgUid,
        to:msgTo,
        checked:false
      };
      $.post('/unReadAdd1',data);
    },

    showBadge:function(badgeNumber){
      return Boolean(badgeNumber);
    },

    subUnreadInDB:function(li_uid,haslevel){
      var data = {
        type: haslevel?'team':'people',
        uid: UID,
        to: li_uid,
        checked: true
      };
      $.post('/unReadTo0',data);
    },
    
    //  当某个messli被点击时，触发该方法
    //  event:触发的事件
    //  liUid:触发事件的对象所需要的对应聊天ID
    //  hasLevel:只有团队才有等级,判断是否是一个团队对象
    //  receiverName:对应接收者的名称，用于聊天框顶部标明在和谁聊天
    //  unread:未读数量,根据未读数量截取聊天记录中的对应消息
    openMessage:function(event, liUid, hasLevel, receiverName, unread){
      main.moreinfoSeen = false;
      // this.$emit('dealU', liUid, hasLevel);

      console.log(arguments);

      main.dealUnread(liUid,hasLevel);
      this.subUnreadInDB(liUid, hasLevel);

      main.messtype = hasLevel?'team':this.type;

      main.messageframeSeen = true;

      $('.messageframe')[0].style.height = '100%';
      $('#messageframe-cont')[0].innerHTML = '';

      main.nameOfmessageframe = receiverName;

      main.messto = liUid;

      console.log(typeof unread);
      console.log('unread:'+unread);
      if(unread){
        this.getUnreadMess(main.messto, unread, main.messtype);
      }
    },

    getUnreadMess:function(getUid,unread,type){
      let data = {
        uid:UID,
        getUid,
        unread,
        type,
      };

      console.log('Data of get unread Messages:');
      console.log(data);

      $.get('/getUnreadMess', data, function(d){
        console.log(d);
        for(i=0;i<d.length;i++){
          main.createMessDiv(d[i], false);
        }
      });
    },

  }
}

</script>


<style lang='less' scoped>

#list{
  height:480px;
  overflow-y: scroll;
  li{
    list-style: none;
    height: 60px;
    &:hover{
      box-shadow:0 0 5px #999;
      cursor:pointer;
    };
      
    .uid{
      display: none;
    }
    .type{
      display: none;
    }

    .info{
      float:left;
      .name{
        height:20px;
      }
      .badge{
        padding:2px 4px 2px 4px;
        border-radius: 50%;
        background-color: red;
      }
      .introduce{
        height:40px;
      }
    }

    img{
      float:right;
      border-radius: 50%;
      width:60px;
      height:60px;
    }
  }
}




</style>