var JoinTeam = {
	template:`
		<div
			v-bind:style="containerStyle"
		>
			<h4>请输入团队口令：</h4>
			<p id='tip'></p>
			<input id='pw' />
			<button
				v-on:click='ok'
				style='box-shadow: 0 0 2px #305598;'
				class='btn btn-primary'
			>确认</button>
			<button
				v-on:click='back'
				style='box-shadow: 0 0 2px #BD931C;'
				class='btn btn-warning'
			>返回主页</button>

		</div>

		<script>
			var tid = '<%= tid%>';
		</script>
	`,
	data:{

		containerStyle:{
			border:'solid 2px #008D8E',
			'border-radius': '0.5em',
			width:'370px',
			display: 'block',
			margin:'20% auto',
			padding:'1em',
			'box-shadow': '0 0 2px #596F8C',
		},
		tipStyle:{
			color:'red',
		}

	},

	methods:{
		back:function(){ 
			zPost('/main',UserEnsure);
		},
		ok:function(){
			var okEnsure = {
				password:document.getElementById('pw').value.trim(),
				uid:UID,
				tid:tid
			};
			$.post('/join_ok',okEnsure,function(judge){
				if(judge){ 
					join.back();
				}else{
					document.getElementById('tip').innerText='口令不对!';
				}
			});
		}
	}
}