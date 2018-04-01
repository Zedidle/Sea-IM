<template>
    <div 
      id='pSearch'
    >
      <todo></todo>
      <stranger></stranger>

      <transition-group tag='ul' name='fadeY-10'>
        <li
          v-for='i in foundPeopleInfo'
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
import stranger from './children/stranger.vue';
import {mapState,mapMutations} from 'vuex';

export default {
	data(){
		return{
  			searchId:''
				
		}
	},
  components:{
    todo,
    stranger,
  },
  computed:{
    ...mapState([
      'foundPeopleInfo',
      
    ]),

  },
  methods:{
    ...mapMutations([
      'showPTodo',
    ]),
    clickLi(uid,e){
      console.log('---------clickLi---------');
      console.log('uid:',uid);
      /*get x and y*/
      console.log('event:')
      console.log(e);
      this.showPTodo({
        uid,
        x:e.clientX-150,
        y:e.clientY-100
      });

    },
  }
}

</script>

<style lang='less' scoped>
	#pSearch{

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




    