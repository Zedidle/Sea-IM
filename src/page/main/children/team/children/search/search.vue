<template>
    <div 
      id='tSearch'
    >
      <todo></todo>
      <team></team>
      <join></join>

      <transition-group tag='ul' name='fadeY-10'>
        <li
          v-for='i in foundTeamsInfo'
          :key='i.uid'
          @click='clickLi(i.uid,$event)'
        >
          <img :src="i.headImg">
          <div>
            <div class='name'>{{i.name}}</div>      
            <div class='introduce'>{{i.introduce}}</div>      
            </div>
        </li>
      </transition-group>
    </div>
</template>

<script>

import todo from './children/todo.vue';
import team from './children/team.vue';
import join from './children/join.vue';
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return{
        searchId:''
        
    }
  },
  components:{
    todo,
    team,
    join,
  },
  computed:{
    ...mapState([
      'foundTeamsInfo',
      
    ]),

  },
  methods:{
    ...mapMutations([
      'showTTodo',
    ]),
    clickLi(uid,e){
      console.log('---------clickLi---------');
      console.log('uid:',uid);
      /*get x and y*/
      console.log('event:')
      console.log(e);
      this.showTTodo({
        uid,
        x:e.layerX-50,
        y:e.layerY
      });

    },
  }
}
</script>

<style lang='less' scoped>
#tSearch{
  
    ul{
      li{
        list-style: none;
        height:60px;
        &:hover{
          cursor:pointer;
          box-shadow:0 0 5px #999;
        };

        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border:1px solid #999;
          float:right;
        }
        div{
          display: inline-block;
          float:left;
          width:200px;
          .name{
            height:20px;
          }
          .introduce{
            height:40px;
          }
        }
      }
    }
}
</style>