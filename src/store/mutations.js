import $ from 'jquery';

export default {


	closeMoreInfo(state){
		state.moreInfoSeen = false;
		state.moreInfo = {};
	},


	showMoreInfo(state){
		console.log('------------showMoreInfo-------------');
		state.moreInfoSeen = true;

		if(!state.moreInfo){
			if(state.messtype==='p'){
				$.get('/getPInfo',{uid:state.messto},d=>{
					console.log('getPInfo:');
					console.log(d);
					state.moreInfo = d;
				});
			}else{
				$.get('/getTInfo',{uid:state.messto},d=>{
					console.log('getTInfo:');
					console.log(d);
					state.moreInfo = d;
				});
			}
		}
	},


	addNewRecentLi(state,msg){
		console.log('-----------addNewRecentLi-----------');

		if(msg.type==='p'){

			console.log('ppppppppppp');
			/*judge if the setence of yourself*/
			if(msg.uid === state.UID){
				/*get the info of messto*/
				// 1 
				console.log('messto:',state.messto);
				$.get('/getPInfo',{uid:messto},d=>{
					console.log('getPInfo callback...');
					console.log(d);
					d.unr = 0;
					state.recentInfo.unshift(d);
				})

			}else{
				/*just save the info from msg*/
				msg.unr = '1';
				state.recentInfo.unshift(msg);
			}
			
		}else if(msg.type==='t'){
			/*just get the team info from state.teamInfo*/
			// 2
			console.log('tttttttttt');
			for(let i of state.teamInfo){
				if(i.uid === msg.uid){
					let o = new Object(i);
					o.unr = '1';
					state.recentInfo.unshift(o);
					break;
				}
			}
		}

	},

	toJoinS(state,team){
		console.log('-----------toJoinS-----------');
		state.teamInfo.unshift(team);
	},

	toJoin(state){
		console.log('----------------toJoinTeam----------------');
		state.isToJoin=true;
		state.onTTodo = false;
	},
	hideJoin(state){
		state.isToJoin=false;
	},


	addStar(state){
		console.log('-----------addStar-----------')
		console.log('UID:',state.UID);
		console.log('star uid : ',state.pTodoProps.uid);
		let uid = state.UID,sid = state.pTodoProps.uid;
		$.post('/addStar',{uid,sid},(d)=>{
			console.log('Result of add star:',d);
			if(!d) return;
			for(let i of state.foundPeopleInfo){
				if(i.uid === sid){
					let flag = false;
					for(let j of state.starInfo){
						if(j.uid===sid){
							flag=true;
							break;
						}
					}
					if(!flag){
						state.starInfo.unshift(i);
					}
					break;
				}
			}
		});
	},




	leaveTeam(state){
		console.log('---------------leaveTeam---------------');
		let uid = state.UID,tid = state.tTodoProps.uid;
		$.post('/leaveTeam',{uid,tid},(d)=>{
			console.log('Result of leave team:',d);
			if(!d) return;
			for(let i=0;i<state.teamInfo.length;i++){
				if(state.teamInfo[i].uid === tid){
					console.log('leaving the team...');
					state.teamInfo.splice(i,1);
					state.onTTodo=false;
					state.tTodoProps={};
					break;
				}
			}
		});

	},

	removeStar(state){
		console.log('-----------removeStar-----------')
		console.log('UID:',state.UID);
		console.log('star uid : ',state.pTodoProps.uid);
		let uid = state.UID,sid = state.pTodoProps.uid;
		$.post('/removeStar',{uid,sid},(d)=>{
			console.log('Result of remove star:',d);
			if(!d) return;
			for(let i=0;i<state.starInfo.length;i++){
				if(state.starInfo[i].uid === sid){
					console.log()
					console.log('the star be removed...');
					state.starInfo.splice(i,1);
					state.onPTodo=false;
					state.pTodoProps={};
					break;
				}
			}
		});
	},

	showSMoreInfo(state,info){
		console.log('-----showStarInfo-----');
		console.log('the star info:');
		console.log(info);
		state.onSMoreInfo = true;
		state.sMoreInfo = info;
	},
	showTMoreInfo(state,info){
		console.log('-----showTeamInfo-----');
		console.log('the team info:');
		console.log(info);
		state.onTMoreInfo = true;
		state.tMoreInfo = info;
	},
	hideSMoreInfo(state){
		console.log('-----hideSMoreInfo-----');
		state.onSMoreInfo=false;
		state.sMoreInfo=null;
	},
	hideTMoreInfo(state){
		console.log('-----hideTMoreInfo-----');
		state.onTMoreInfo=false;
		state.tMoreInfo=null;	
	},
	showTImgUpdate(state,dataURL){
		state.onTImgUpdate = true;
		state.newTHeadImg = dataURL;
	},
	hideTImgUpdate(state){
		state.onTImgUpdate = false;
		state.newTHeadImg = null;
		// let cropperContainer = document.querySelector('#myteam .cropper-container');
		// console.log('cropper-container');
		// console.log(cropperContainer);
		// cropperContainer.parentElement.removeChild(cropperContainer);
	},

	updatePImgS(state,headImg){
		state.userInfo.headImg = headImg;
	},
	updateTImgS(state,headImg){
		for(let i of state.teamInfo){
			if(i.uid === state.UID){
				console.log('get myteam in teamInfo');
				i.headImg = headImg;
				break;
			}
		}
		for(let i of state.recentInfo){
			if(i.uid === state.UID && i.level){
				console.log('get myteam in recentInfo');
				i.headImg = headImg;
				break;
			}
		}
	},

	showPImgUpdate(state,dataURL){
		state.onPImgUpdate = true;
		state.newPHeadImg = dataURL;
	},
	hidePImgUpdate(state){
		state.onPImgUpdate = false;
		state.newPHeadImg = null;
		// let cropperContainer = document.querySelector('#me .cropper-container');
		// console.log('cropper-container');
		// console.log(cropperContainer);
		// cropperContainer.parentElement.removeChild(cropperContainer);
	},
	
	showTTodo(state,props){
		console.log('mutations:showTTodo:')
		state.onTTodo = true;
		state.tTodoProps = props;  /*uid,x,y*/
	},
	hideTTodo(state){
		state.onTTodo = false;
	},

	showPTodo(state,props){
		console.log('mutations:showPTodo:')
		state.onPTodo = true;
		state.pTodoProps = props;  /*uid,x,y*/
	},
	hidePTodo(state){
		state.onPTodo = false;
	},

	getMoreMessage(state){
    //读取现有信息长度
    let skip = state.messContent.length;

    console.log('---------getMoreMessage---------');
    console.log('now messages in content: skip:')
    console.log(skip);

	let getMoreMBtn = document.getElementById('getMoreMessageOnFrame-btn');
	getMoreMBtn.style.color = '#7CC';
	setTimeout(()=>{getMoreMBtn.style.color = '#555';},2000);

    console.log('mess record length:');
    console.log(state.messRecord.length);
    if(state.messRecord.length){
    	console.log('get messages from record');
		addMoreMessages(state.messRecord);
    }else{
		console.log('get messages from DB');
		//获取更多聊天记录
		$.get('/getMoreMessage', {
			receiveUid:state.UID,
			fromUid:state.messto,
			type:state.messtype
		}, (m)=>{
			console.log('get the messages from DB:');
			console.log(m);
			state.messRecord = m?m:[];
			addMoreMessages(m);
		});
    }

  	function addMoreMessages(messR){
  		console.log('addMoreMessages');
    	let mr = null;
    	for(let i=0;i<5;i++){
	  		mr = messR[messR.length-1-skip-i];
	  		if(mr){
		        mr.content = expressionsParse(mr.content);
	  			state.messContent.unshift(mr);
	  		}else{
	  			/*no more*/
	  			console.log('no more');
	  			setTimeout(()=>{
	  				getMoreMBtn.style.color = 'red';
	  				setTimeout(()=>{getMoreMBtn.style.color = '#555';},2000);
	  			},500);
	  			break;
	  		}
	  	}
	  	let cont = document.getElementById('messageframe-cont');
	  	cont.scrollTop = 0;
  	}

  },

	searchTeam(state,keyword){

		console.log('---------searchTeam---------')
		console.log('keyword:');
		console.log(keyword);
		$.get('/searchTeam',{
			keyword,
		},(d)=>{
			console.log('searchTeam-callback:');
			console.log(d);
			state.foundTeamsInfo=d;
		})
	},


	searchPeople(state,keyword){

		console.log('---------searchPeople---------')
		console.log('keyword:');
		console.log(keyword);
		$.get('/searchPeople',{
			keyword,
		},(d)=>{
			console.log('searchPeople-callback:');
			console.log(d);
			state.foundPeopleInfo=d;
		})
	},


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
	toggleRegistS(state,d){ 
		console.log('-------------toggleRegistS----------------')
		console.log(d);
		state.isSuccessRegist = !state.isSuccessRegist;
		state.rUid = d.uid;
		state.rPw = d.pw;
	},


	findTeams(state,keyword){

		console.log('findTeams');
		console.log(state.teamInfo);
		console.log(keyword);

		if(keyword){
			state.foundTeamsInfo = [];
			for(let i of state.teamInfo){
				if(i.uid.match(keyword)||i.name.match(keyword)){
					state.foundTeamsInfo.push(i);
				}
			}
		}
		console.log(state.foundTeamsInfo);
	},

	findStars(state,keyword){

		console.log('findStars');
		console.log(state.starInfo);
		console.log(keyword);

		if(keyword){
			state.foundStarsInfo = [];
			for(let i of state.starInfo){
				if(i.uid.match(keyword)||i.name.match(keyword)){
					state.foundStarsInfo.push(i);
				}
			}
		}
		console.log(state.foundStarsInfo);
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
		console.log(d.list);
		console.log(d.punr);
		console.log(d.tunr);
		console.log(d.recentInfo);
		console.log(d.starInfo); //X
		console.log(d.teamInfo); //X

		state.punr = JSON.parse(d.punr);
		state.tunr = JSON.parse(d.tunr);
		state.recentInfo = JSON.parse(d.recentInfo);

		//unread and recentInfo

		console.log('state.punr:');
		console.log(state.punr);
		console.log('state.tunr:');
		console.log(state.tunr);
		console.log('state.recentInfo:');
		console.log(state.recentInfo);
		for(let i in state.punr){
			// console.log(i);
			for(let j of state.recentInfo){

				console.log(Boolean(j.level));
				if(!j.level && j.uid===i){
					j.unr = state.punr[i];
					console.log(j.unr)
					break;
				}
			}
		}

		for(let i in state.tunr){
			// console.log(i);
			for(let j of state.recentInfo){
				console.log(Boolean(j.level));

				if(j.level && j.uid===i){
					j.unr = state.tunr[i];
					console.log(j.unr)
					break;
				}
			}
		}



		state.starInfo = JSON.parse(d.starInfo);
		state.teamInfo = JSON.parse(d.teamInfo);

	},



	/*是否作出更多操作的开关*/
	toggleDomore(state){
		state.onDomore = !state.onDomore;
      	console.log('toggleDomore ok!');
      	console.log(state.onDomore);
	},

	togglePeople(state){
		state.onPeople = !state.onPeople;
	},
	showPSearch(state){
		state.onPSearch = true;
	},
	hidePSearch(state){
		state.onPSearch = false;
	},


	toggleTeam(state){
		state.onTeam = !state.onTeam;
	},
	showTSearch(state){
		state.onTSearch = true;
	},
	hideTSearch(state){
		state.onTSearch = false;
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







//-------------------messageframe----------------------

	showMessageframe(state,d){


		state.messto = d.uid;
		state.messname = d.name;
		state.messtype = d.type;
		state.messageframeSeen = true;
		console.log('-------|||SHOW-MESSAGEFRAME|||-------');
		console.log(d.uid,d.name,d.type);


	},

	closeMessageframe:function(state){
	  state.messageframeSeen=false;
	  state.teamMembersSeen=false;
	  state.messtype=null;
	  state.messto=null;
	  state.moreInfo=null;
	  state.moreInfoSeen=false;
      state.messContent = [];
      state.messRecord = [];
      document.getElementById('messageframe-input').value = '';
    },

    toggleExpressions(state){
    	console.log('toggleExpressions');
    	state.expressionsSeen = !state.expressionsSeen;

    },

    clearMContent(state){
    	state.messContent = [];
    },

    pushMContent(state,msg){
    	
        msg.content = expressionsParse(msg.content);

    	state.messContent.push(msg);
    	setTimeout(()=>{
	        let cont = document.getElementById('messageframe-cont');
    	    cont.scrollTop = cont.scrollHeight;
    	},100);

    	if(state.messRecord.length){
    		state.messRecord.length++;
    	}

    },

    unshiftMContent(state,msgs){
    	state.messContent = []
    },





// ---------------add unread base on type and uid;


}







	    function expressionsParse(msgContent){
	      while(msgContent.match(/\#\(.{1,4}\)/)){
	        var msgMatch = String(msgContent.match(/\#\(.{1,4}\)/))
	        
	        console.log(msgMatch.slice(2,-1));
	        var t = expressionToMark(msgMatch.slice(2,-1));

	        msgContent = msgContent.replace(
	          /#\(.{1,4}\)/,
	          `<div
	            style='background-image:url(img/faces.png); 
	              background-position:0px -${t*30}px;
	              width:30px;
	              height:30px;
	              display: inline-block;'
	          >
	          </div>`
	          );
	      }
	      return msgContent;
	    }

    	function expressionToMark(expressionMark){
          var t;
          switch(expressionMark){
            case '呵呵':t = 0; break;
            case '哈哈':t = 1; break;
            case '吐舌':t = 2; break;
            case '啊':t = 3; break;
            case '酷':t = 4; break;
            case '怒':t = 5; break;
            case '开心':t = 6; break;
            case '汗':t = 7; break;
            case '泪':t = 8; break;
            case '黑线':t = 9; break;
            case '鄙视':t = 10; break;
            case '不高兴':t = 11; break;
            case '真棒':t = 12; break;
            case '钱':t = 13; break;
            case '疑问':t = 14; break;
            case '阴险':t = 15; break;
            case '吐':t = 16; break;
            case '咦':t = 17; break;
            case '委屈':t = 18; break;
            case '花心':t = 19; break;
            case '呼':t = 20; break;
            case '笑眼':t = 21; break;
            case '冷':t = 22; break;
            case '太开心':t = 23; break;
            case '滑稽':t = 24; break;
            case '勉强':t = 25; break;
            case '狂汗':t = 26; break;
            case '乖':t = 27; break;
            case '睡觉':t = 28; break;
            case '惊哭':t = 29; break;
            case '生气':t = 30; break;
            case '惊讶':t = 31; break;
            case '喷':t = 32; break;
            case '爱心':t = 33; break;
            case '心碎':t = 34; break;
            case '玫瑰':t = 35; break;
            case '礼物':t = 36; break;
            case '彩虹':t = 37; break;
            case '星星月亮':t = 38; break;
            case '太阳':t = 39; break;
            case '钱币':t = 40; break;
            case '灯泡':t = 41; break;
            case '咖啡':t = 42; break;
            case '蛋糕':t = 43; break;
            case '音乐':t = 44; break;
            case 'haha':t = 45; break;
            case '胜利':t = 46; break;
            case '大拇指':t = 47; break;
            case '弱':t = 48; break;
            case 'ok':t = 49; break;
          }
          return t;
        }