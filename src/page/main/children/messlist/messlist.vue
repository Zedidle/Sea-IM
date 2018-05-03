<template>
  <ul id='list'>
    <li
      @click='clickMessLi({uid:i.uid,name:i.name,type:i.level?"t":"p"})'
      v-for='i in recentInfo'
    >
      <span class='uid'>{{i.uid}}</span>
      <span class='type'>{{i.level?'t':'p'}}</span>
      
      <div class='info'>
        <div class='name'>
          {{i.name}} <span class='unread' v-show='i.unr' >{{i.unr}}</span>
        </div>

        <div class='introduce'>{{i.introduce}}</div>
      </div>
      
      <img :src='i.headImg'>
    
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
  overflow-y:scroll;
  height:30rem;
  width:100%;
  transform:translateX(1rem);
  li{
    list-style: none;
    height: 4rem;
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
      float: left;
      .name{
        font-size:0.8rem;
        height:1rem;
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
        font-size:0.8rem;
        height:3rem;
      }
    }

    img{
      float: right;
      border-radius: 50%;
      border:1px solid #333;
      width:60px;
      height:60px;
    }
  }
}

</style>