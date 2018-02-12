<template>
    <div id='people-search'>
      Search-People
		</div>
</template>

<script>
	export default {
		data(){
			return{
    			searchId:''
					
			}
		},
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

      if(this.searchId === UID){
        $('#search-person-info').html(
          "<div class='alert alert-info' role='alert'>无法查询你自己</div>"
          );
        return false;
      }

      $('#search-uid')[0].style.width='70%';
      $('#search-close')[0].style.transform = 'translateX(0)';
      $('#search-info')[0].style.display = 'block';

      var t = this;
      $.get("/search",{uid:this.searchId },function(d){
        var team = d.team;
        var person = d.person;
        t.createSearchTeamInfo(team);
        t.setSearchTeamStatus(team);
        t.createSearchPersonInfo(person);
        t.setSearchPersonStatus(person);
      });

    },
    
    createSearchPersonInfo:function(person){
      $('#search-person-info').html(vCreateSearchPersonInfoTemplate(person));
    },

    createSearchTeamInfo:function(team){
      $('#search-team-info').html(vCreateSearchTeamInfoTemplate(team));
    },

    setSearchTeamStatus:function(team){
      if(!team){
        return false;
      }

      var t = this;
      $('#join').click(function(){
        var data = {
          uid:UID,
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
        document.querySelector('.messageframe').style.height='100%';
        main.messtype = 'recent';
        main.messto = t.searchId;
        main.nameOfmessageframe = $(this).siblings('#pinfo').find('#name').text();

      });

      $('#search-star-info').click(function(){
        var stars = loginlist.star;
        var isStar = false;
        var data = { 
          sid:t.searchId,
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
</script>

<style lang='less' scoped>
	

</style>




    