var SearchContent = {
  template:
    `<div id='search-content' >
      <div id='search' v-on:keyup.enter='getSearchResponse'>
      <button
        id='sub'
        v-on:click='getSearchResponse'
      >
        <span class='glyphicon glyphicon-search' aria-hidden='true'></span>
      </button>
      <input
        v-model.trim='searchId'
        id='search-uid'
        name='search_uid'
        placeholder='请输入团队或用户的ID'
      >
      <div
        id='search-close'
        v-on:click='closeCheckInfo'
      >
        <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
      </div>
    </div>
    <div id='search-info'>
      <div id='search-person-info'></div>
      <div id='search-team-info'></div>
    </div>
  </div>`,
  data:function(){
    return {
      searchId:''
    };
  },
  methods:{

    closeCheckInfo:function(){
      this.searchId = '';

      $('#search-uid')[0].style.width = '78%';
      $('#search-close')[0].style.transform = 'translateX(-100%)';
      $('#search-info')[0].style.display = 'none';
    },
    
    getSearchResponse:function(){
      $('#search-team-info').html('');
      $('#search-person-info').html('');
      if(this.searchId === ''){
        return false;
      }

      $('#search-uid')[0].style.width='70%';
      $('#search-close')[0].style.transform = 'translateX(0)';
      $('#search-info')[0].style.display = 'block';

      var t = this;
      $.get("/search",{ uid:this.searchId },function(d){
        var team = d.team;
        var person = d.person;
        t.createSearchTeamInfo(team);
        t.setSearchTeamStatus(team);
        t.createSearchPersonInfo(person);
        t.setSearchPersonStatus(person);
      });
    },
    
    createSearchTeamInfo:function(team){
      $('#search-team-info').html(v_createSearchTeamInfo_template(team));
    },

    createSearchPersonInfo:function(person){
      $('#search-person-info').html(v_createSearchPersonInfo_template(person));
    },

    setSearchTeamStatus:function(team){
      if(!team){ return false; }
      var t = this;
      $('#join').click(function(){
        var data = {
          uid:uid,
          tid:t.searchId
        };
        $.get('/joinJudge',data,function(judge){
          if(judge==='ok'){ 
            zPost('/join',data); 
          }else{
            $('#search-team-info').append(
              "<div class='alert alert-info'>"+judge+"</div>"
            );
          }
        });
      });
    },

    setSearchPersonStatus:function(person){
      if(!person){ return false; }

      var t = this;
      $('#send').click(function(){

        main.messageframeSeen = true;
        main.messtype = 'recent';
        main.messto = t.searchId;
        main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();

      });

      $('#search-star-info').click(function(){
        var stars = loginlist.star;
        var isStar = false;
        var data = { 
          sid:searchComponent.searchId,
          uid:uid
        };
        if(stars.length){
          for(var i=0;i<stars.length;i++){
            if(stars[i]===data.sid){
              isStar = true;
              break;
            }
          }
        }
        if(isStar){
          $('#search-person-info').prepend(
            "<div class='alert alert-info' role='alert'>已经标记过！</div>"
          );
        }else{
          $.post('/star',data,function(data_back){
            v_addThePeopleInStar(data_back);
            loginlist.star.push(data.sid);
            $('#search-person-info').prepend(
              "<div class='alert alert-success' role='alert'>成功标记该用户!</div>"
            );
          });
        }
      });
    }
  }
};