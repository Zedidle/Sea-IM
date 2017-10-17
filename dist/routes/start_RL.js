const CHECK = require('./lib/check');
const assert = require('assert');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
const time = require('./lib/retime');
const mongoose=require('mongoose');
const User = require('../mongoModel/user');
const Unread = require('../mongoModel/unread');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();

















//Start
router.get('/',(req,res)=>{
	res.render('login.ejs', { 
		tipInfo:'' 
	})
})

//Register
router.get('/regist',(req,res)=>{
	res.render('regist.ejs',{
		tipuid:'',
	});
})

router.post('/registInfo', urlencodedParser, (req,res)=>{

	var uid = req.body.uid;
	var password = req.body.password;

	new Promise((resolve)=>{
		User.find({uid},null,{limit:1},(err, detail)=>{
			resolve((detail[0])?true:false);
		});
  	}).then(isUserExist=>{
		if(isUserExist){
			res.render('regist.ejs',{
				tipuid:'用户名已被占用',
			});
		}else{
			var hash = crypto.createHash('sha1');
			hash.update(password)
			var pwd = hash.digest('hex');

			var user = new User({
				uid,
				password:pwd,
				login:false,
			});
			var unread = new Unread({
				uid,
				punReadNumber:{
					"0":"0",			
				},
				tunReadNumber:{
					"0":"0",
				},
			}); 
			var people = new People({
				uid,
				headImg:'/img/defaultHead.jpg',
				sex : '保密',
		    	name : '未命名',
		    	introduce:'这家伙很懒,什么也没有写．',
		    	hobby : '保密',
		    	birthday : '保密',
			});
			var loginlist = new Loginlist({ 
				uid,  
				recent:{
					people:[],team:[]
				}, 
				star:[], 
				team:[]
			});
			var message = new Message({
				uid,
				mess:{'0':'0'},
			});

			user.save((err)=>{
				res.render('registInfo.ejs', { 
					tipInfo:'注册成功！' 
				})
			});
			unread.save();
			people.save();
			loginlist.save();
			message.save();
		}
	});
});









//Login
router.post('/', urlencodedParser,(req,res)=>{


	var 
		hash = crypto.createHash('sha1'),
		sess = req.session,
		uid = req.body.uid,
		password = req.body.password;
		console.log(1);

	if(!uid.length||!password.length){
		res.render('login.ejs',{ 
			tipInfo:"用户名或密码不能为空！", 
		})
	}
		console.log(2);

	hash.update(password);
	var pwd = hash.digest('hex');
		console.log(3);

	User.find({uid},'login',{ limit: 1 },(err,detail)=>{
		console.log(4);
		if(!sess.login){ sess.login = {}};
		var islogin = sess.login[uid];
		// if(detail[0]){ islogin = detail[0].login; }

		if(islogin){
			console.log(5);
			console.log('(user)'+uid+" had already logined!");
			res.render('login.ejs',{
				tipInfo:"用户已经登录！", 
			})
		}else{
	User.find({uid,password:pwd},null,{ limit : 1 },(err,detail)=>{
		if(!detail.length){
			res.render('login.ejs',{ 
				tipInfo:"用户名不存在或密码错误！", 
			})
			return false;
		}
		console.log(6);




//main too
	var login_process = new Promise((resolve,reject)=>{
		console.log(7);

		//获取用户的个人信息
		People.find({uid},(err,peopleInfo)=>{
			if(!sess.info){ 
				sess.info={}; 
			}
			sess.info[uid] = peopleInfo[0];
			//为用户获得未读信息的数目
			Unread.find({uid},(err,unread)=>{
				resolve({
					user_info:sess.info[uid],
					unread:unread[0],
				});
			})
		});
	}).then((uu)=>{
		console.log(8);

		var 
			user_info = uu.user_info,
			punReadNumber = uu.unread.punReadNumber,
			tunReadNumber = uu.unread.tunReadNumber;
			CHECK(user_info,'user_info');

			//获取登录后的联系对象列表
	Loginlist.find({uid},(err,detail)=>{
		let loginlist = JSON.stringify(detail[0]);
		console.log(9);

		CHECK(detail[0],"loginlist");
		var 
			recent_people = detail[0].recent.people,
			recent_team = detail[0].recent.team,
			star = detail[0].star,
			team = detail[0].team;

			// CHECK(recent_people,"recent_poeple");
			// CHECK(recent_team,"recent_team");

var getinfo = Promise.all([
	new Promise(function(resolve,rejected){
		console.log(10);

	//获取最近联系对象信息列表
			// console.log("recent_people.length: "+recent_people.length);
			// console.log("recent_team.length: "+recent_team.length);
		if(recent_people.length || recent_team.length){
			var recentinfo = [];
			var total_length = recent_people.length + recent_team.length;
			console.log("total_length: "+total_length);
			recent_people.forEach(a=>{
				People.find({uid:a},(err,detail)=>{
					recentinfo.push(detail[0]);
					if(recentinfo.length===recent_people.length){
						if(recentinfo.length === total_length){
							resolve(recentinfo);
						}else{
							recent_team.forEach(b=>{
								Team.find({uid:b},(err,detail)=>{
									recentinfo.unshift(detail[0]);
									if(recentinfo.length === total_length){
										resolve(recentinfo);
									}
								});
							});
						}
					}
				});
			});
		}else{ resolve([]) };
	}),
	new Promise(function(resolve,rejected){
		console.log(12);

		//获取朋友信息列表
		if(star.length){
			var	starinfo = [];
			star.forEach(a=>{
				People.find({uid:a},(err,detail)=>{
					starinfo.push(detail[0]);
					if(star.length===starinfo.length){ resolve(starinfo); }
				})
			})
		}else{ resolve([]); }
	}),
	new Promise(function(resolve,rejected){
		//获取团队信息列表
		console.log(13);

		if(team.length){
			var	teaminfo = [];
			team.forEach(a=>{
				Team.find({uid:a},(err,detail)=>{
					teaminfo.push(detail[0]);
					if(team.length===teaminfo.length){ resolve(teaminfo); }
				})
			})
		}else{ resolve([]) }
	})
	]).then(info=>{
		console.log(14);
		
		var 
			recentinfo = info[0],
			starinfo = info[1],
			teaminfo = info[2];

			// CHECK(recentinfo,"recentinfo");
		var 
			J_user_info = JSON.stringify(user_info),
			J_recentinfo = JSON.stringify(recentinfo),
			J_starinfo = JSON.stringify(starinfo),
			J_teaminfo = JSON.stringify(teaminfo),
			J_punReadNumber = JSON.stringify(punReadNumber);
			J_tunReadNumber = JSON.stringify(tunReadNumber);


//设置用户登录状态为true
User.update({uid},{$set:{login:true}},(err)=>{
	console.log('(user)'+uid+' login ↑');
	//At the same time, make the session login of user true;
	if(!sess.login){sess.login={}};
	if(!sess.makeUserSessLogout){ sess.makeUserSessLogout = {} };
	if(!sess.makeUserDBLogout){ sess.makeUserDBLogout = {} };
	sess.login[uid] = true;
	console.log(sess.login);
	console.log(sess.makeUserSessLogout);
	console.log(sess.makeUserDBLogout);
	//After login, set a interval to make user logout if user has not any action.
	sess.makeUserSessLogout[uid] = setInterval(function(){
		//Every 5 minutes, make user logout , 
		//It can do any action to make itself relogin.
		console.log('Make (user)'+uid+' logout in session!');
		sess.login[uid] = false;
	},60000);//1min
	sess.makeUserDBLogout[uid] = setInterval(function(){
		if(!sess.login[uid]){
			User.update({uid},{$set:{login:false}},(err)=>{
				console.log('Make (user)'+uid+' logout in DB!');
				clearInterval(sess.makeUserSessLogout[uid]);
				clearInterval(sess.makeUserDBLogout[uid]);
			})
		}
	},1800000)//30min
	// console.log(sess.makeUserSessLogout[uid]);
	// console.log(sess.makeUserDBLogout[uid]);
});

		res.render('main.ejs',{
			uid,
			punReadNumber:J_punReadNumber,
			tunReadNumber:J_tunReadNumber,
			user_info:J_user_info,
			loginlist,
			recentinfo:J_recentinfo,
			starinfo:J_starinfo,
			teaminfo:J_teaminfo,
		})
	});
	});
	});
//main too
	});
	}
	})
	});



router.post('/logOff',urlencodedParser,(req,res)=>{
	var uid = req.body.uid;
	var sess = req.session;
	// console.log(sess.makeUserSessLogout); //undefined
	// console.log(sess.makeUserDBLogout); //undefined
	// clearInterval(sess.makeUserSessLogout[uid]);
	// clearInterval(sess.makeUserDBLogout[uid]);
	User.update({uid},{$set:{login:false}},(err)=>{
		console.log('(user)'+uid+" logoff ↓");
	});
	// CHECK(sess.login,'All status of login');
	res.render('login.ejs',{
		tipInfo:''
	});
});

// router.post('/exit',urlencodedParser,(req,res)=>{
// 	var data = JSON.parse(req.body.J_data);
// 	CHECK(data,'exit');
// 	User.update({uid:data.uid},{$set:{login:false}},(err)=>{
// 		console.log('(user)'+data.uid+" exit ↓↓");
// 		res.send(req.body.J_data);
// 	})
// });

// router.post('/relogin',urlencodedParser,(req,res)=>{
// 	var data = JSON.parse(req.body.J_data);
// 	CHECK(data,'relogin');
// 	User.update({uid:data.uid},{$set:{login:true}},(err)=>{
// 		console.log('(user)'+data.uid+" relogin ↑↑");
// 		res.send(req.body.J_data);
// 	})
// });

module.exports = router;