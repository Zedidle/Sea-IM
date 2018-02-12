<template>
	<div id="people">
		<div class="top">
			<div>Me</div>
			<div>Star</div>
			<div>Search</div>
		</div>
		
		<!-- <router-view></router-view> -->
		<transition name='fadeY-10'>
			<me></me>
		</transition>	
		<transition name='fadeY-10'>
			<stars></stars>
		</transition>	
		<transition name='fadeY-10'>
			<search></search>
		</transition>	
	</div>


</template>



<script>
	import me from './children/me.vue';
	import stars from './children/stars.vue';
	import search from './children/search.vue';

	import {mapState,mapMutations} from 'vuex';
	export default {
		data(){
			return{

			}
		},
		components:{
			me,
			stars,
			search,
		},
		computed:{
			...mapState([
			]),
		},
		methods:{
			...mapMutations([
			]),
		}
	}


</script>



<style lang='less' scoped>
	

</style>