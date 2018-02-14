<template>
  <div 
    id="team"
    v-show='onTeam'
  >

    <div 
      class="close"
      @click = 'toggleTeam'
    >
      <i class='icon iconfont icon-wrong'></i>
    </div>

    <div class="top">

      <transition name='fadeY-10'>
      <div
        id='operator'
        v-show='!onTSearch'
      >
        <div>
          <i class='icon iconfont icon-gerenzhongxin'></i>
        </div>
        <div>
          <i class='icon iconfont icon-earth'></i>
        </div>
        <div
          @click='showTSearch'
        >
          <i class='icon iconfont icon-originalimage'></i>
        </div>
      </div>
      </transition>


      <transition name='fadeY-10'>
      <div 
        id='search'
        v-show='onTSearch'
      >
        <span
          @click='hideTSearch'
        >
          <i class='icon iconfont icon-close'></i>
        </span>
        <input 
          v-model='tsInput'
        >
        <div
        >
          <i class='icon iconfont icon-originalimage'></i>
        </div>
      </div>
      </transition>


    </div>
    
<!--    <div class="content">
      <transition name='fadeY-10'>
        <myteam></myteam>
      </transition> 
      <transition name='fadeY-10'>
        <jointeam></jointeam>
      </transition> 
      <transition name='fadeY-10'>
        <search></search>
      </transition> 
    </div> -->

  </div>


</template>



<script>
  import myteam from './children/myteam/myteam.vue';
  import jointeam from './children/otherteams/otherteams.vue';
  import search from './children/search/search.vue';

  import {mapState,mapMutations} from 'vuex';
  export default {
    data(){
      return{
        psInput:'',
      }
    },
    components:{
      myteam,
      jointeam,
      search,
    },
    computed:{
      ...mapState([
        'onTeam',
        'userInfo',
        'onTSearch',
      ]),
    },
    methods:{
      ...mapMutations([
        'toggleTeam',
        'showTSearch',
        'hideTSearch',
      ]),
    }
  }


</script>



<style lang='less' scoped>
  #team{
    
    width: 300px;
    height: 500px;
    box-shadow: 0 0 10px #999;
    position:absolute;
    top:50%;
    left:50%;
    transform: translateX(-50%) translateY(-50%);
    background:rgba(255,255,255,0.9);
    z-index:10000001;


    .close{
      width: 100%;
      height:40px;
      line-height: 34px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      border-bottom:2px solid #7CC;
      &:hover{
        i{
          color:red;
        }
      }
    }
    .top{
      height:40px;


      #operator{
        height:40px;
        div{
          text-align: center;
          font-weight: 600;
          float: left;
          width:100px;
          line-height:40px; 
          height: 40px;
          border-bottom:1px solid #7CC;

          &:hover{
            box-shadow: 0 0 5px #999;
            color:#77CCCC;
            cursor:pointer;
          };

        }
      }

      #search{
        span{
          display: inline-block;
          float:left;
          height:40px;
          width:40px;
          line-height: 35px;
          text-align: center;
          font-size:22px;
          &:hover{
            cursor: pointer;
            color:red;
            box-shadow: 0 0 5px #999;
          };
        }
        
        input{
          border:none;
          float:left;
          font-size: 18px;
          background:transparent;
          height:40px;
          width:200px;
          &:hover{
            box-shadow: 0 5px 5px #999;
            color:#77CCCC;
          };    
        }

        div{
          float:left;
          width:60px;
          height:40px;
          line-height: 40px;
          text-align: center;
          &:hover{
            cursor: pointer;
            box-shadow: 0 0 5px #999;
            color:#77CCCC;
          };
        }
      }
    }

    .content{
      height:440px;
    }
  }

</style>