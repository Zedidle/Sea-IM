import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
	latitude: '', // 当前位置纬度
	longitude: '', // 当前位置经度

	login: false,//是否登录
	UID: null,//用户ID
	userInfo: null, //用户信息
	
	headImg:null,//头像地址
    talkskip: false, //当前聊天框的聊天数目
    isWantToLogOff:false, //是否想要退出
    isDomore:false,  // 是否显示更多操作选项列表
    messShowType:'recent', //消息列表展示类型，在旧版本会有recent/star/team,而新版本将会取消  


    messageframeSeen:false,  //是否显示聊天框
    moreinfoSeen:false,  //是否显示聊天对象的更多信息
    
    moreInfo:{    //更多消息的模板，聊天框右上角显示的信息 和 读取更多消息
      headImg:'', //头像
      uid:'',     //对象id
      name:'',    //对象昵称
      level:'',   //如果是团队，则会有等级
      memeber:'', //如果是团队则会有成员
      sex:'',     //性别
      hobby:'',   //爱好
      birthday:'',//生日
      introduce:''//介绍
    },

    teamMembersSeen:false, //是否显示团队成员
    messtype:'', //聊天的类型： “team/people/recent/star”
    messto:'', //聊天对象的ID
    nameOfmessageframe:'', //聊天对象的昵称
    expressionSeen:false, //是否表情列表
    
    recentInfo:false,//最近聊天信息列表，1.1版本以下可用
    starInfo:false,  //星标过的对象列表，1.1版本以下可用
    teamInfo:false,  //团队列表，1.1版本以下可用

	subBtnText:'更新', //更新按钮的提示内容
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})