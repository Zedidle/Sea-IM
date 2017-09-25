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
            <div class="major">'Major: {{build.major}}</div>
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
            <div class="major">'Major: {{i.major}}</div>
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
  data:{
        
  },

  methods:{

  }
  
})
















 



    // var jteamul = doc.querySelector('jteam ul');
    // var jointeam = jointeam.replace(reg,"\"");
    //     jointeam = JSON.parse(jointeam);
    
    //     jointeam.forEach(function(a){

    //         var 
    //             li = doc.createElement('li'),
    //             info = doc.createElement('info'),
    //             id = doc.createElement('id'),
    //             teamname = doc.createElement('teamname'),
    //             level = doc.createElement('level'),
    //             membernumber = doc.createElement('membernumber'),
    //             major = doc.createElement('major'),
    //             introduce = doc.createElement('introduce'),
    //             avator = doc.createElement('avator'),
    //             img = doc.createElement('img');

    //         avator.appendChild(img);
    //         info.appendChild(id);
    //         info.appendChild(teamname);
    //         info.appendChild(level);
    //         info.appendChild(membernumber);
    //         info.appendChild(major);
    //         info.appendChild(introduce);

    //         li.appendChild(avator);
    //         li.appendChild(info);

    //         jteamul.appendChild(li);

    //         img.src = a.headImg;
    //         id.innerText = 'ID: '+a.id;
    //         teamname.innerText = 'Teamname: '+a.teamname;
    //         level.innerText = 'Level: '+a.level;
    //         membernumber.innerText = 'Member number: '+a.membernumber;
    //         major.innerText = 'Major: '+a.major;
    //         introduce.innerText = 'Introduce: '+a.introduce;

    //     })
