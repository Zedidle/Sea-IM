import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex);

const state = {
  latitude: '', // 当前位置纬度
  longitude: '', // 当前位置经度






//----------------------视图显示部分----------------------

  loginOrRegist: 'l' || 'r', //开始界面时，是处于登录状态还是注册状态, l:login ; r:regist
  showLogoff:false, //是否想要退出
  isSuccessRegist: false,  //处于注册成功状态
  onDomore:false, //是否展开更多操作
  messageframeSeen:false,//是否显示聊天框
  moreinfoSeen:false,    //是否显示聊天对象的更多信息
  teamMembersSeen:false, //是否显示团队成员

// -----------------------------------------------------










//------------------登录成功时需要更新的数据----------------
//通过Mutations里的getAllLoginData方法...

  isLogin: false,   //是否登录
  UID: null,        //用户ID
  
  //记录当前登入用户信息 
  userInfo: {       
    headImg:null, 
    name: null,
    introduce: null,
    sex: null,
    hobby: null,
    birthday: null,

  },

  list:null,
  punr:null,
  tunr:null,
  recentInfo:false,//最近聊天列表,会把个人和团队的做一个整合
  starInfo:false,  //星标列表
  teamInfo:false,  //团队列表

// -----------------------------------------------------











//------------------messageframe部分的数据-----------------
  
  messto:'',             //聊天对象的ID
  messname:'', //聊天对象的昵称
  messtype:'',           //聊天的类型：“team/people/recent/star”
  expressionSeen:false,  //是否表情列表
  talkskip: false,       //当前聊天框的聊天数目

  
  //更多消息的模板，聊天框右上角显示的信息 和 读取更多消息
  moreInfo:{    
    headImg:'', //头像
    uid:'',     //对象id
    name:'',    //对象昵称
    level:'',   //如果是团队,则会有等级
    memeber:'', //如果是团队,则会有成员
    sex:'',     //性别
    hobby:'',   //爱好
    birthday:'',//生日
    introduce:''//介绍
  },


// ------------------------------------------------------




  

	subBtnText:'更新', //更新按钮的提示内容
}




export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})