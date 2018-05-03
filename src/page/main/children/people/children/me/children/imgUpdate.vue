<template>
	
	<div
		id='imgUpdate'
		v-show='onPImgUpdate'
	>
		<!-- <input type="file"> -->
		<img
			id='newPHeadImg'
			:src="newPHeadImg"
		>

		<div
			id='imgOperators'
		>
			<button
				@click = 'clickCancel'
			>
				Cancel		
			</button>
			<button
				@click='subNewImg'
			>
				Submit
			</button>
		</div>
	</div>
	
	
</template>

<script>

// import Cropper from 'vue-cropperjs';
// import Cropper from 'cropperjs';
import $ from 'jquery';
import {mapState,mapMutations} from 'vuex';


	export default{
		updated(){
			console.log('------imgUpdate be updated-----------');
			let img = document.getElementById('newPHeadImg');
			console.log('BOOLEAN of img src:');
			console.log(Boolean(img.src));
			if(!img.src) return;
			console.log(img);
			this.imgCropper = new Cropper(img, {
			  aspectRatio: 1,
			  crop: function(e) {
			  	console.log('crop...');
			  }
			});
			console.log('cropper:');
			console.log(this.imgCropper);
		},
		data(){
			return{
				imgCropper:null,
			}
		},
		computed:{
			...mapState([
				'UID',
				'onPImgUpdate',
				'newPHeadImg',
			]),

		},
		methods:{
			...mapMutations([
				'hidePImgUpdate',
				'updatePImgS',
			]),
			clickCancel(){
				delete this.imgCropper;
				console.log('after delete img cropper...')
				console.log(this.imgCropper);
				this.hidePImgUpdate();
			},
			subNewImg(){
				console.log('--------subNewImg--------');
				if(!this.imgCropper) return ;
				
				console.log('this.imgCropper:');
				console.log(this.imgCropper);
				let vm = this;

				let canvas = this.imgCropper.getCroppedCanvas({width:100,height:100});
				console.log('The Canvas is :');
				console.log(canvas);

				canvas.toBlob(d=>{
					console.log('The Blob of canvas:');
					console.log(d);
					let formData = new FormData();
					formData.append('headImg',d);
					formData.append('uid',vm.UID);
					$.ajax('/meUpdateImage', {
						method: "POST",
						data: formData,
						mimeType: "multipart/form-data",
						processData: false,
						contentType: false,
						success: function (headImg) {
							console.log('Upload success');
							vm.clickCancel();
							vm.updatePImgS(headImg);
						},
						error: function () {
							console.log('Upload error');
						}
					});
				})
			}
		}
	}
</script>

<style lang='less' scoped>
	#imgUpdate{
		border:solid 1px solid #999;
		box-shadow: 0 0 3px #999;
		position:fixed;
		top:50%;
		left:50%;
		transform: translateX(-50%) translateY(-50%);
	}	
	#newPHeadImg{
		width:400px;
	}

	#imgOperators{
		button{
			border:none;
			padding:10px;
			box-shadow: 0 0 5px #999;
			
			&:first-of-type{
				background-color:#364975;
			}

		}
	}
</style>