const store = new Vuex.Store({
  state: {
    count: 0,
    userinfo: false,
    talkskip: false,
    isWantToLogOff:false,

    moreInfo:{
      headImg:'',
      uid:'',
      name:'',
      level:'',
      memeber:'',
      sex:'',
      hobby:'',
      birthday:'',
      introduce:''
    },

    isDomore:false,
    moreinfoSeen:false,
    teamMembersSeen:false,
    messtype:'',
    messto:'',
    nameOfmessageframe:'',
    messageframeSeen:false,
    expressionSeen:false,
    messShowType:'recent',
    
    userInfo:false,
    recentInfo:false,
    starInfo:false,
    teamInfo:false,







	name:name||false,
	personHeadImage:false,
	introduce:false,
	sex:false,
	hobby:false,
	birthday:false,
	subBtnText:'更新',
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});

store.commit('increment');

console.log("store.state.count:" + store.state.count) // -> 1