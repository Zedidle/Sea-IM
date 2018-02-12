<template>
    <div
      id='myteam'
    >
      <div class='panel panel-default'>
        <div class='panel-heading'>
            <div>
              <button
                    id='backToMainPage-btn'
                    v-on:click = 'backToMainPage'
                    class='btn btn-default'
                >返回主页
                </button>

                <button
                    v-if='buildTeam'
                    id='updateMyteam-btn'
                    v-on:click='updateMyteam'
                    class='btn btn-primary'
                >进入我的团队界面
                </button>

            </div>
            <h3>你所创建的团队</h3>
        </div>

        <div class='panel-body'>
            <h4 v-if='!buildTeam'>你还没有建立自己的团队</h4>
            <div v-else>
                <img 
                    class='avator' 
                    v-bind:src='buildTeam.headImg'
                />
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
                </div>
            </div>
        </div>
    </div>

    <div class='panel panel-default'>
        <div class='panel-heading'>
            <h3>你所加入的团队</h3>
        </div>

        <div class='panel-body'>
            <h4 v-if='!joinTeams.length'>没有团队记录</h4>
            <div v-else >
                <div v-for='i in joinTeams'>
                    <div class='avator'>
                        <img v-bind:src='i.headImg' />
                    </div>
                
                    <div class='info'>
                        <div class='id'>ID: {{i.uid}}</div>
                        <div class='teamname'>团队名称: {{i.name}}</div>
                        <div class='level'>等级: {{i.level}}</div>
                        <div class='membernumber'>成员数量: {{i.membernumber}}</div>
                        <div class='introduce'>
                            <h4>队长豪言：</h4>
                            {{i.introduce}}
                        </div>
                    </div>
                </div>
            </div>

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





