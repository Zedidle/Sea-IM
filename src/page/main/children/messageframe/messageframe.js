$('#main').append(`
<div
  v-show='messageframeSeen'
  class='messageframe'
>
  <div class='messageframe-top'>
    <div
      class='messageframe-close'
      v-on:click='messageframeClose'
    >
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    </div>
    
    <div>[{{messtype}}]{{nameOfmessageframe}}</div>
    
    <div
      class='messageframe-info'
      v-on:click='getMoreInfo'
    >
      <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
    </div>
  </div>

	<div
		class="getMoreMessageOnFrame-btn"
		v-on:click='getMoreMessage'
	>Get More Message
	</div>

    <div
    	id='messageframe-cont'
    	class='messageframe-cont'
    	v-on:scroll='messageContentOnScroll'
    ></div>

    <div
    	v-show='expressionSeen'
    	class='messageframe-expression'>
    </div> 

    <div class='messageframe-say'>
      <button
      	class='messageframe-face'
      	v-on:click='showExpressions'
      >
      	<span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span> 
      </button>

      <input
      	id='messageframe-input'
      	v-on:keyup.enter='sendMessage'
      >

      <button
      	v-on:click='sendMessage'
      	class='messageframe-subm'
      >
        <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      </button>
    </div>

	<div
    v-show='moreinfoSeen'
    class='moreinfo'
  >
		<div
      v-show='teamMembersSeen'
      class='teamMembers'
    >
			<div v-on:click='closeTeamMembers'>
				<span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
			</div>
			<ul></ul>
		</div>
    
		<div style='float:left;'>
			<div
        class='moreinfo-close'
        v-on:click='closeMoreinfo'
      >
				<span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
			</div>
			
      <img v-bind:src="moreInfo.headImg" />
			
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
          v-on:click='starOrUnstar'
          class="btn btn-success"
          aria-haspopup="true"
          aria-expanded="false"
        >Star/Unstar
        </button>
				<button
          v-show='!isTeam'
          v-on:click='deleteTheRecentChat'
          class="btn btn-warning"
          aria-haspopup="true"
          aria-expanded="false"
        >Delete Chat
        </button>
				<button
          v-show='isTeam'
          v-on:click='exitTeam'
          class="btn btn-danger"
          aria-haspopup="true"
          aria-expanded="false"
        >Exit Team
        </button>
				<button
          v-show='isTeam'
          v-on:click='showMembers'
          class="btn btn-primary"
          aria-haspopup="true"
          aria-expanded="false"
        >Show Members
        </button>
			</div>
		</div>
	</div>
</div>
`);