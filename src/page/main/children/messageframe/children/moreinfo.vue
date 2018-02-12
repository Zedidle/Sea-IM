<template>
<div
    v-show='moreinfoSeen'
    class='moreinfo'
>
    <div
      v-show='teamMembersSeen'
      class='teamMembers'
    >
      <div @click='closeTeamMembers'>
      </div>
      <ul></ul>
    </div>
    
    <div style='float:left;'>
      <div
        class='moreinfo-close'
        @click='closeMoreinfo'
      >
      C-ICON
      </div>
      
      <img :src="moreInfo.headImg" />
      
      <hr style='border-color: #C0D0D0;border-width: 2px;'>
     

      <div class="info">
        <div>
          <h3>UID&nbsp: </h3>
          <h4>{{moreInfo.uid}}</h4>
        </div>
        <div>
          <h3>名称&nbsp: </h3>
          <h4>{{moreInfo.name}}</h4>
        </div>
        <div v-show='isTeam'>
          <h3>等级&nbsp: </h3>
          <h4>{{moreInfo.level}}</h4>
        </div>
        <div v-show='isTeam'>
          <h3>人数&nbsp: </h3>
          <h4>{{moreInfoTeamMemberNumber}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>性别&nbsp: </h3>
          <h4>{{moreInfo.sex}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>爱好&nbsp: </h3>
          <h4>{{moreInfo.hobby}}</h4>
        </div>
        <div v-show='!isTeam'>
          <h3>生日&nbsp: </h3>
          <h4>{{moreInfo.birthday}}</h4>
        </div>
        <div>
          <h3>介绍&nbsp: </h3>
          <h4>{{moreInfo.introduce}}</h4>
        </div>
      </div>
      <hr style=' float:left; width:100%;border-color: #C0D0D0;border-width: 1px;'>
      <div class="more">
        <button 
          v-show='!isTeam'
          @click='starOrUnstar'
          class="btn btn-success"
          aria-haspopup="true"
          aria-expanded="false"
        >Star/Unstar
        </button>
        <button
          v-show='!isTeam'
          @click='deleteTheRecentChat'
          class="btn btn-warning"
          aria-haspopup="true"
          aria-expanded="false"
        >Delete Chat
        </button>
        <button
          v-show='isTeam'
          @click='exitTeam'
          class="btn btn-danger"
          aria-haspopup="true"
          aria-expanded="false"
        >Exit Team
        </button>
        <button
          v-show='isTeam'
          @click='showMembers'
          class="btn btn-primary"
          aria-haspopup="true"
          aria-expanded="false"
        >Show Members
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import {mapState,mapMutations} from 'vuex';
	export default {
		data(){
			return {

			}
		},
		methods:{
			starOrUnstar:function(){
	      var stars = Loginlist.star;
	      var data = {
	        uid:UID,
	        to:main.messto,
	        isStar:false,
	      };
	      for(var i=0;i<stars.length;i++){
	        if(stars[i]===main.messto){
	          data.isStar = true;
	          break;
	        }
	      }

	      $.post('/starOrUnstar', data, function(data_back) {
	        if(data.isStar){
	          vRemovePersonInStar(data.to);
	          Loginlist.star.pull(data.to);
	        }else{
	          vAddPersonInStar(data_back);
	          Loginlist.star.push(data.to);
	        }
	      });
	    },
		}
	}
</script>

<style lang='less' scoped>
	
</style>