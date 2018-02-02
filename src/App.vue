<template>
	<div>
		<transition name="router-fade" mode="out-in">
			<keep-alive>
				<div>2333</div>
			    <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
			</keep-alive>
    	</transition>
    	<transition name="router-fade" mode="out-in">
				<div>2444</div>
			<!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
		</transition>
		<svg-icon></svg-icon>	
    </div>
</template>

<script>
	// import svgIcon from './components/common/svg';
  	export default {
    	components:{
            // svgIcon
        },
  	}
</script>

<style lang="less">
  	// @import './style/common';
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>