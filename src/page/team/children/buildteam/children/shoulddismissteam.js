const ShouldDismissTeam = {
	template:`
		<h4 style='color:#333;'>你已经建立了一个团队，需要先解散原团队.</h4>
			<button id='dismiss' class="btn btn-warning">解散原团队</button>
			<button id='back' class="btn btn-default">返回</button>
	
	<script>
		document.getElementById('dismiss').onclick = function(){
			window.location.href='/dismissTeam?uid='+UID;
		}

		document.getElementById('back').onclick = function(){ 
			zPost('/main',UserEnsure);
		}
	</script>

	`,
	data:function(){
		return {
			style1:{
				'padding-top':'50px';
				'text-align': 'center';
				'margin':'15% auto';
				'border-top':'solid 5px #AA2233';
				'border-bottom':'solid 5px #AA2233';
				'display': 'block';
				'width': '80%';
				'height':'200px';
				'box-shadow': '5px 5px 10px #999';
			}
		}
	
	}
}




