// import Vue from "vue";
// import VueRouter from 'vue-router';

// Vue.use(VueRouter);


export default {

	// 直接转换成登录状态
	startLogin(state){
		state.loginOrRegist = 'l';
	},

	/*直接转换成注册状态*/
	startRegist(state){
		state.loginOrRegist = 'r';
	},
	
	/*直接转换成登录状态*/
	toLogin(state){
		state.isLogin = true;
	},
  	


  	//切换注册成功状态的开关
	toggleRegistS(state){ 
		state.isSuccessRegist = !state.isSuccessRegist;
	},

	/*登录时获取所有用户信息的方法*/
	getAllLoginData(state,d){
		console.log('-------|||GET-ALL-LOGIN-DATA|||-------');

		state.isLogin = true;
		state.UID = d.uid;
		state.userInfo = JSON.parse(d.user_info);
		state.list = JSON.parse(d.list);
		console.log(d.uid);
		console.log(d.user_info);
		console.log(d.list); //X
		console.log(d.punr);
		console.log(d.tunr);
		console.log(d.recentInfo);
		console.log(d.starInfo); //X
		console.log(d.teamInfo); //X

		state.punr = JSON.parse(d.punr);
		state.tunr = JSON.parse(d.tunr);
		state.recentInfo = JSON.parse(d.recentInfo);
		state.starInfo = JSON.parse(d.recentInfo);
		state.teamInfo = JSON.parse(d.recentInfo);

	},



	/*是否作出更多操作的开关*/
	toggleDomore(state){
		state.onDomore = !state.onDomore;
      	console.log('toggleDomore ok!');
      	console.log(state.onDomore);
	},



	/*显示是否提示注销的开关*/
	toLogoff(state){
		state.showLogoff = !state.showLogoff;
	},

	/*确认了注销然后触发的事件*/
	ensureLogoff(state){
		state.isLogin = false;
		state.UID = null;
		state.userInfo = null;
		state.list = null;
		state.punr = null;
		state.tunr = null;
		state.recentInfo = null;
		state.starInfo = null;
		state.teamInfo = null;

		state.showLogoff = false;
		state.onDomore = false;
	},

	/*取消了注销然后触发的事件*/
	cancelLogoff(state){
		state.showLogoff = false;
		state.onDomore = false;
	},



	showMessageframe(state,d){
		state.messto = d.uid;
		state.messname = d.name;
		state.messtype = d.type;
		state.messageframeSeen = true;
		console.log('-------|||SHOW-MESSAGEFRAME|||-------');
		console.log(d.uid,d.name,d.type);
	}
}