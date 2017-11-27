Vue.component('team-info',{
  props:['uid','teaminfo'],
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div style='font-size:2em'>建立        
        <button id='update' @click='update' v-if='build' class="btn btn-primary">更新</button>
        <button id='back' @click = 'back'  class="btn btn-default">返回主页</button>
        </div>
      </div>
      <div class="panel-body">
        <h3 v-if='!build'>Not Record</h3>
        <div class="team" v-if='build'>
          <div class="avator"> <img v-bind:src='build.headImg' /> </div>
          <div class="info">
            <div class="id">ID: {{build.uid}}</div>
            <div class="teamname">Teamname: {{build.name}}</div>
            <div class="level">Level: {{build.level}}</div>
            <div class="membernumber">Member number: {{build.membernumber}}</div>

            <div class="introduce">Introduce: {{build.introduce}}</div>
          </div>
        </div>
      </div>

      <div class="panel panel-default">
      <div class="panel-heading"><h2>加入</h2></div>
      <div class="panel-body">
        <h3 v-if='!join.length'>Not Record</h3>
        <div class="team" v-if='join.length' v-for='i in join'>
          <div class="avator"> <img v-bind:src='i.headImg' /> </div>
          <div class="info">
            <div class="id">ID: {{i.uid}}</div>
            <div class="teamname">Teamname: {{i.name}}</div>
            <div class="level">Level: {{i.level}}</div>
            <div class="membernumber">Member number: {{i.membernumber}}</div>

            <div class="introduce">Introduce: {{i.introduce}}</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  data:function(){
    return {
      uidEnsure:{ uid:this.uid }
    }
  }
  ,computed:{
    _teaminfo:function(){
      return JSON.parse(this.teaminfo);
    },
    build:function(){
      var b=false;
      for(let i of this._teaminfo){
        if(i.uid===this.uid){ console.log(602); b = i; break;}
      }
      return b;
    },
    join:function(){
      var j=[];
      for(let i of this._teaminfo){
        if(i.uid!==this.uid){ j.push(i) }
      }
      return j;
    }
  }
  ,methods:{
    test:function(){},
    back:function(){ formPostUrl('/main',this.uidEnsure); },
    update:function(){ formPostUrl('/teams',this.uidEnsure); }
  }
})

var app = new Vue({
  el:'#myteam',
  data:{},
  methods:{}
})
