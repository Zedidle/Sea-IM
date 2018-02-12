<template>
	<div id='dismissTeam'>
		<div class="title">
			解散团队
		</div>
		<form
			id='dismissForm'
			action="/successDismissTeam"
			method="post"
		>
			<div class="form-group">
			    <input
			    	class="form-control"
					v-model.trim='teamId'
					v-on:focus='focusTeamId'
					v-on:blur='blurTeamId'
					name="teamId"
					placeholder='输入团队ID'
				>
	    		<label
	    			for="teamId"
					v-bind:style='styleTipTeamId'
	    		>{{tipTeamId}}
	    		</label>
			 </div>

			<div class="form-group">
				<input 
					type="password" 
					class="form-control"
					v-on:focus='focusTeamPassword'
					v-on:blur='blurTeamPassword'
					v-model.trim='teamPassword'
					name="teamPassword"
					placeholder='输入团队口令'
				>
				<label
					for="teamPassword"
					v-bind:style='styleTipTeamPassword'
				>{{tipTeamPassword}}
				</label>
			</div>
	  	
		  	<button
		  		id='formSubmit-btn'
				v-on:click='formSubmit'
				class="btn btn-danger"
				type="button"
			>确认解散
			</button>
			
			<button
				id='backToMainPage-btn'
				type='button'
				class="btn btn-default"
				v-on:click='backToMainPage'
			>返回主页
			</button>
			<br clear='both'>
		</form>
	</div>
</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
		teamId:'',
		teamPassword:'',

		tipTeamId:'',
		tipTeamPassword:'',

		styleTipTeamId:{
			height:'15px',
			color:'green'
		},
		styleTipTeamPassword:{
			height:'15px',
			color:'green'
		},
		dismissTeamStyle:{
			marginTop:'10%',
			width:'300px',
	        border:'1px solid #B71210',
	        boxShadow: '0 0 2px #55FFD6',
	        padding:0,
		},
		titleStyle:{
		    backgroundColor:'#BB1111',
			color:'#FFF',
		    marginBottom:'20px',
		    height:'30px',
		    lineHeight: '30px',
		    fontWeight:600,
		    fontSize:'16px',
		    textAlign: 'center',
		},

		dismissFormStyle:{
			margin:'20px'
		},

		formSubmitBtnStyle:{
			width:'60%',
			float:'left',
		},
		backToMainPageBtnStyle:{
			width:'30%',
			float:'right',
		}
    }
  },
  computed:{
    ...mapState([

    ]),
	flagTeamId:function(){
		return isSame(this.teamId,UID);
	},
	flagTeamPassword:function(){
		return isSame(this.teamPassword,TeamPassword);
	}
  },
  methods:{
    ...mapMutations([

    ]),
	focusTeamId:function(){
		this.tipTeamId = '请输入团队ID';
	},
	blurTeamId:function(){
		if(this.flagTeamId){
			this.tipTeamId = 'ID正确';
			this.styleTipTeamId.color = 'green';
		}else{
			this.tipTeamId = 'ID不正确';
			this.styleTipTeamId.color = 'red';
		}
	},

	focusTeamPassword:function(){
		this.teamPassword = '请输入团队口令'; 
	},
	blurTeamPassword:function(){
		if(this.flagTeamPassword){
			this.tipTeamPassword = '口令正确';
			this.styleTipTeamPassword.color = 'green';
		}else{
			this.tipTeamPassword = '口令不正确';
			this.styleTipTeamPassword.color = 'red';
		}
	},

	formSubmit:function(){

		if(this.flagTeamId && this.flagTeamPassword){
			document.getElementById('dismissForm').submit();
			return true;
		}

		if(!this.flagTeamId){
			this.tipTeamId = 'ID不正确';
		}

		if(!this.flagTeamPassword){
			this.tipTeamPassword = '口令不正确';
		}
	},
  }
}

</script>

<style lang='less' scoped>
    
</style>