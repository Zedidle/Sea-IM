var myteam = new Vue({
  el:'#myteam',
  data:{
    teaminfos:teaminfos

  },
  computed:{
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
    backToMainPage:function(){
      zPost('/main',UserEnsure);
    },
    updateMyteam:function(){

      window.location.href='/teams?uid='+UID;

      // zPost('/teams',UserEnsure);
    }
  }

});