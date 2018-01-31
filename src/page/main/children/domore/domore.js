const Domore = {
  template:
    `<div id='domore'>
      <div
        id='logOff'
        v-on:click='logOff'
      >注销</div>

      <div 
        id='person'
        v-on:click='getPersonInfo'
        class='ele'
        data-toggle='tooltip'
        data-placement='left'
        title='个人信息'
      >
        <span class='glyphicon glyphicon-user' aria-hidden='true'></span>
      </div>
      <div
        id='myteam'
        v-on:click='getTeamsInfo'
        class='ele'
        data-toggle='tooltip'
        data-placement='top'
        title='团队'
      >
        <span class='glyphicon glyphicon-fire' aria-hidden='true'></span>
      </div>
      <div
        id='buildTeam'
        v-on:click='toBuildATeam'
        class='ele'
        data-toggle='tooltip'
        data-placement='bottom'
        title='创建团队'
      >
        <span class='glyphicon glyphicon-grain' aria-hidden='true'></span>
      </div>
    </div>`,
  data:function(){
    return {
    };
  },
  methods:{
    logOff:function(){
      main.isWantToLogOff = true; 
    },
    getPersonInfo:function(){
      zPost('/people',UserEnsure);
    },
    getTeamsInfo:function(){
      zPost('/myteam',UserEnsure);
    },
    toBuildATeam:function(){
      zPost('/DealWithTeam',UserEnsure);
    },
  }
};