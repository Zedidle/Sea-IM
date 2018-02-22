<template>
  <ul
    id='list'
  >
      <li
        @click='clickMessLi({uid:i.uid,name:i.name,type:i.level?"t":"p"})'
        v-for='i in recentInfo'
      >
        <span class='uid'>{{i.uid}}</span>
        <!-- !!!can not change the sequence!!!-->
        <span class='type'>{{i.level?'t':'p'}}</span>

        <div class='info'>
          <div class='name'>
            {{i.name}}
            <span class='unread' v-show='i.unr' >{{i.unr}}</span>
          </div>

          <div class='introduce'>{{i.introduce}}</div>
        </div>

        <img :src=i.headImg>
    </li>
  </ul>

</template>


<script>
import {mapState,mapMutations} from 'vuex';
import $ from 'jquery';

export default {

  data(){
    return {

    }
  },
  
  computed:{
    ...mapState([
      'recentInfo',
      'UID',
    ]),
  },
  methods:{
    ...mapMutations([
      'toggleDomore',
      'showMessageframe',
      'pushMContent',
      'clearMContent',
    ]),

    clickMessLi(d){
      this.showMessageframe(d);
      this.subUnread(d);
    },

    subUnread(d){

      //sub unread base on type and uid;
      let recentInfo = document.querySelectorAll('#list>li');
      let uid,type,unr;

      for(let i of recentInfo){
        uid = i.querySelector('.uid').innerText;
        type = i.querySelector('.type').innerText;
        if(uid===d.uid && type===d.type){
          unr = i.querySelector('.unread').innerText;
          i.querySelector('.unread').innerText = '';
          i.querySelector('.unread').style.display = 'none';
          if(unr){
            //get unread messages
            let vm = this;
            $.get('/getUnreadMess', {
              uid:this.UID,
              getUid:d.uid,
              type:d.type,
              unr,
            }, d=>{
              vm.clearMContent();
              for(let i of d){
                vm.pushMContent(i);
              }
            });
          }
          break;
        }
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
    subUnreadInDB:function(li_uid,haslevel){
      var data = {
        type: haslevel?'team':'people',
        uid: UID,
        to: li_uid,
        checked: true
      };
      $.post('/unReadTo0',data);
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
        .unread{
          color: #FFF;
          border-radius: 10px;
          background-color: red;
          display: inline-block;
          padding: 2px 5px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          text-align: center;
        }
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