<template>
	<div
      v-show='expressionSeen'
      class='messageframe-expression'>
    </div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';



	export default{
		data(){
			return {
				
			}
		},


		methods:{
			showExpressions:function(){
				this.expressionSeen = !this.expressionSeen;

		      var faces = document.querySelector('.messageframe-expression');
		      faces.innerHTML = '';
		     
		      for(var i=0;i<50;i++){
		        var d = document.createElement('div');
		        d.style.backgroundPosition = 'left -'+i*30+'px';    
		        d.style.backgroundImage = 'url(img/faces.png)'; 
		        d.value = i;
		        faces.appendChild(d);
		      }
		    },
		        expressionsParse:function(msgContent){
      while(msgContent.match(/\#\(.{1,4}\)/)){
        var msgMatch = String(msgContent.match(/\#\(.{1,4}\)/));
        
        console.log(msgMatch.slice(2,-1));
        var t = expressionTextToImage(msgMatch.slice(2,-1));

        msgContent = msgContent.replace(
          /#\(.{1,4}\)/,
          `<div
            class='expression-chatting'
            style='background-image:url(img/faces.png); 
              background-position:0px -${t*30}px;'
          >
          </div>`
          );
      }
      return msgContent;
    },
		}

	}	
</script>

<style lang='less' scoped>
	

</style>