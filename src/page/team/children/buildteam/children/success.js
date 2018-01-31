const SuccessBuildTeam = {
	template:`
		.container{
			padding-top:50px;
			text-align: center;
			margin:15% auto;
			border-top:solid 5px #44CCAA;
			border-bottom:solid 5px #44CCAA;
			display: block;
			width: 80%;
			height:200px;
		}
		<h4 style='color:#333;'>
			成功建立团队!
			<br>
			把口令告诉你的朋友,方便他们加入哦!
		</h4>
		<button id='back' class='btn btn-default'>知道了</button>
	</div>


	<script>
		$('#back')[0].onclick = function(){
			zPost('/main',UserEnsure);
		}
	</script>	
	`,
}


