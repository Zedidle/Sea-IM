<template>
    <div
      id='myteam'
    >
<!--       <h4 v-if='!buildTeam'>还没有建立自己的团队</h4>
      <div v-else>
        <img 
          class='avator' 
          :src='buildTeam.headImg'
        >
        <div class='info'>
          <div class='teamname'>
            团队名称: {{buildTeam.name}}
          </div>
          <div class='level'>
            等级: {{buildTeam.level}}
          </div>
          <div class='membernumber'>
            成员数量: {{buildTeam.membernumber}}
          </div>
          <div class='introduce'>
            <h4>队长豪言：</h4>
            {{buildTeam.introduce}}
          </div>
      </div> -->

    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
      teaminfos:null
    }
  },
  computed:{
    ...mapState([

    ]),
    buildTeam:function(){
      var t = this.teaminfos;

      for(var i=0;i<t.length;i++){
        if(t[i].uid === UID){
          return t[i];
        }
      }
      return false;
    },
    joinTeams:function(){
      var j=[];
      var t = this.teaminfos;
      for(var i=0;i<t.length;i++){
        if(t[i].uid !== UID){
          j.push(t[i]);
        }
      }
      return j;
    }
  },
  methods:{
    ...mapMutations([

    ]),
    updateMyteam:function(){
      console.log('UPDATE MYTEAM');
      // window.location.href='/teams?uid='+UID;
    }
  }
}

</script>

<style lang='less' scoped>
    
</style>





