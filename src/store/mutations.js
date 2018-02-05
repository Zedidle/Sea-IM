export default {
	startLogin(state){
		state.loginOrRegist = 'l';
	},
	startRegist(state){
		state.loginOrRegist = 'r';
	},
	toLogin(state){
		state.isLogin = true;
	},
  	
  	//切换注册成功状态
	toggleRegistS(state){ 
		state.isSuccessRegist = !state.isSuccessRegist;
	}
}