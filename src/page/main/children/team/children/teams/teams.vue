<template>
  <div 
    id="teams"
  >
    <todo></todo>
    <team></team>


    <!-- find stars in your list base on keyword-->
    <div class='find'>
      <div>
        <i class='icon iconfont icon-search'></i>
        <input
          v-model='teamsKeyword'
          @keyup='keyupFTI'
          @focus='focusFTI'
          @blur='blurFTI'
        >
      </div>
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


    <!-- all stars in your list -->
    <ul>
      <li 
        v-for="i in teamInfo"
        :key="i.uid"
        @click = 'clickLi(i.uid,$event)'
      >
        <img :src="i.headImg">
        <div>
          <div class='name'>{{i.name}}</div>      
          <div class='introduce'>{{i.introduce}}</div>  
          </div>
        </li>
    </ul>

  </div>
</template>
<script>
import todo from './children/todo.vue';
import team from './children/team.vue';
import {mapState,mapMutations} from 'vuex';
  export default {
    data(){
      return{
        teamsKeyword:'',
        ensureFind:false,
        intervalFind:null,
        timeoutCancelF:null,
      }
    },
    components:{
      todo,
      team,
    },
    computed:{
      ...mapState([
        'teamInfo',
        'foundTeamsInfo',
      ]),
    },

    methods:{
      ...mapMutations([
        'findTeams',
        'showTTodo',
      ]),
      clickLi(uid,e){
        console.log('---------clickLi---------');
        console.log(uid);
        /*get x and y*/
        console.log('event:')
        console.log(e);
        this.showTTodo({
          uid,
          x:e.layerX-50,
          y:e.layerY
        });

      },
      keyupFTI(){
        this.ensureFind = true;
        clearTimeout(this.timeoutCancelF);
        let vm = this;
        this.timeoutCancelF = setTimeout(()=>{
          vm.ensureFind = false;
        },500);
      },
      focusFTI(){
        console.log('focusFTI');
        let vm = this;
        this.intervalFind = setInterval(()=>{
          if(vm.ensureFind){
            vm.findTeams(vm.teamsKeyword);
          }
        },500)
      },
      blurFTI(){
        clearInterval(this.intervalFind);
      }
    }

  }
</script>
<style lang='less' scoped>
  #teams{
    width:100%;
    .find{
      border-bottom:1px solid #7BB;
      &>div{
        text-align: center;
        input{
          display: inline-block;
          width:200px;
          border:none;
          background:transparent;
          height:24px;
          border-bottom:1px solid #7CC;
          &:hover{
            box-shadow:0 0 5px #999;
          };
        }
      };
    }
    ul{
      li{
        list-style: none;
        height:60px;
        width:100%;

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