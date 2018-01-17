$('#main').append(`
<div v-show='messageframeSeen' class='messageframe'>
    <div class='messageframe_top'>
      <div
      	v-on:click='messageframeClose'
      	class='messageframe_close'
      >
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      </div>
      <div>[{{messtype}}]{{nameOfmessageframe}}</div>
      <div
      	v-bind:class='{messageframe_info:true}'
      	v-on:click='checkMoreinfo'
      >
        <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
      </div>
    </div>

	<div
		class="getMoreMessageOnFrame_btn"
		v-on:click='getMoreMessage'
	>Get More Message
	</div>

    <div
    	id='messageframe_cont'
    	class='messageframe_cont'
    	v-on:scroll='messageContentOnScroll'
    ></div>

    <div
    	v-show='expressionSeen'
    	class='messageframe_expression'>
    </div> 

    <div class='messageframe_say'>
      <div
      	class='messageframe_face'
      	v-on:click='showExpressions'
      >
      	<span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span> 
      </div>

      <input
      	id='messageframe_input'
      	v-on:keyup.enter='sendMessage'
      ></input>

      <button
      	v-on:click='sendMessage'
      	class='messageframe_subm'
      >
        <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      </button>
    </div>

	<div v-show='moreinfoSeen' class='moreinfo'>
		<div v-show='teamMembersSeen' class='teamMembers'>
			<div v-on:click='closeTeamMembers'>
				<span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
			</div>
			<ul></ul>
		</div>
		<div style='float:left;'>
			<div class='exit'  v-on:click='closeMoreinfo'>
				<span style='cursor: pointer;' class="glyphicon glyphicon-remove" aria-hidden="true"></span>
			</div>
			<img v-bind:src="messInfo.headImg" />
			<hr style='border-color: #C0D0D0;border-width: 2px;'>
			<div class="info">
				<div><h3>UID&nbsp: </h3><h4>{{messInfo.uid}}</h4></div>
				<div><h3>名称&nbsp: </h3><h4>{{messInfo.name}}</h4></div>
				<div v-show='isteam'><h3> 等级&nbsp: </h3><h4>{{messInfo.level}}</h4></div>
				<div v-show='isteam'><h3>人数&nbsp: </h3><h4>{{messInfo.membernumber}}</h4></div>
				<div v-show='!isteam'><h3>性别&nbsp: </h3><h4>{{messInfo.sex}}</h4></div>
				<div v-show='!isteam'><h3>爱好&nbsp: </h3><h4>{{messInfo.hobby}}</h4></div>
				<div v-show='!isteam'><h3>生日&nbsp: </h3><h4>{{messInfo.birthday}}</h4></div>
				<div><h3>介绍&nbsp: </h3><h4>{{messInfo.introduce}}</h4></div>
			</div>
			<hr style=' float:left; width:100%;border-color: #C0D0D0;border-width: 1px;'>
			<div class="more">
				<button type="button" v-show='!isteam'  v-on:click='starOrUnstar' class="btn btn-success" aria-haspopup="true" aria-expanded="false">Star/Unstar</button>
				<button type="button" v-show='!isteam'  v-on:click='deleteTheRecentChat' class="btn btn-warning" aria-haspopup="true" aria-expanded="false">Delete Chat</button>
				<button type="button" v-show='isteam' v-on:click='exitTeam' class="btn btn-danger" aria-haspopup="true" aria-expanded="false">Exit Team</button>
				<button type="button" v-show='isteam' v-on:click='showMembers' class="btn btn-primary" aria-haspopup="true" aria-expanded="false">Show Members</button>
			</div>
		</div>
	</div>
</div>
`);