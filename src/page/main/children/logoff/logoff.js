var Logoff = {
	template:`
	  <div
	    class='logOffJudgeHide'
	    v-bind:class='{logOffJudgeShow:isWantToLogOff}'
	  >
	    <div class='title'>
	      确认注销吗？
	    </div>

	    <div
	      id='ensureLogOff-btn'
	      v-on:click = 'ensureLogOff'
	    >确认
	    </div>
	    
	    <div
	      id='cancelLogOff-btn'
	      v-on:click = 'cancelLogOff'
	    >取消
	    </div>
	  </div>
	`,
}