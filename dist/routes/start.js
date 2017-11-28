const LIB = require('./lib');
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


//start: login page,
router.get('/',(req,res)=>{ res.render('login.ejs', { tipInfo:'' }); });

//used by public/js/login.js g5,
router.get('/regist',(req,res)=>{ res.render('regist.ejs',{  tipuid:'' }); });

//used by views/regist.ejs g58,
router.post('/registInfo', urlencodedParser, (req,res)=>{

	var uid = req.body.uid;
	var password = req.body.password;

	new Promise((resolve)=>{
		User.find({uid},null,{limit:1},(err, detail)=>{
			resolve(detail[0]?true:false);
		});
  	}).then(isUserExist=>{
		if(isUserExist){
			res.render('regist.ejs',{ tipuid:'用户名已被占用', });
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
				punRead:{"0":"0",},
				tunRead:{"0":"0",},
			}); 
			var people = new People({
				uid,
				headImg:'/img/defaultHead.jpg',
				sex : '保密',
		    	name : 'User'+Math.random()*Math.random()*10000,
		    	introduce:'这家伙很懒,什么也没有写．',
		    	hobby : '保密',
		    	birthday : '保密',
			});
			var loginlist = new Loginlist({ 
				uid,
				recent_people:[],
				recent_team:[],
				star:[], 
				team:[]
			});
			var message = new Message({
				uid,
				mess:{'0':'0'},
			});

			user.save((err)=>{ res.render('registInfo.ejs', {  tipInfo:'注册成功！'  }) });
			unread.save();
			people.save();
			loginlist.save();
			message.save();
		}
	});
});






//Login: used by views/login.ejs g134
router.post('/', urlencodedParser,(req,res)=>{
	console.log('login: get the data');
	var 
		hash = crypto.createHash('sha1'),
		uid = req.body.uid,
		password = req.body.password;

	console.log('login: ensure uid and password not empty')
	if(!uid.length||!password.length){
		res.render('login.ejs',{  tipInfo:"用户名或密码不能为空！",  });
		return false;
	}
	hash.update(password);
	var pwd = hash.digest('hex');

	User.find({uid},null,{ limit: 1 },(err,detail)=>{
		console.log('login: judge login status of the user');
		if(detail[0].login){
			console.log('(user)'+uid+" had already logined!");
			res.render('login.ejs',{ tipInfo:"用户已经登录！",  });
		}else{
			User.find({uid,password:pwd},null,{ limit : 1 },(err,detail)=>{
				if(!detail.length){
					res.render('login.ejs',{ tipInfo:"用户名不存在或密码错误！", });
					return false;
				}
				//enter the process to get information about the user to login,
				//main too
				var login_process = new Promise((resolve,reject)=>{
					People.find({uid},null,{limit:1},(err,peopleInfo)=>{
						Unread.find({uid},null,{limit:1},(err,unread)=>{
							resolve({ user_info:peopleInfo[0], unread:unread[0] });
						})
					});
				}).then((infoForLogin)=>{
					var 
						user_info = infoForLogin.user_info,
						punRead = infoForLogin.unread.punRead,
						tunRead = infoForLogin.unread.tunRead;

					console.log('login: get the loginlist of the user');
				
					Loginlist.find({uid},null,{limit:1},(err,detail)=>{

						var J_loginlist = JSON.stringify(detail[0]),
							recent_people = detail[0].recent_people,
							recent_team = detail[0].recent_team,
							star = detail[0].star,
							team = detail[0].team;

						var getinfo = Promise.all([
							new Promise(function(resolve,rejected){

								//get the list of recent chat information
								if(recent_people.length || recent_team.length){
									var recentinfo = [];
									var total_length = recent_people.length + recent_team.length;
									recent_people.forEach(personid=>{
										People.find({uid:personid},null,{limit:1},(err,peopleInfo)=>{
											recentinfo.push(peopleInfo[0]);
											if(recentinfo.length===recent_people.length){
												if(recentinfo.length === total_length){
													resolve(recentinfo);
												}else{
													recent_team.forEach(teamid=>{
														Team.find({uid:teamid},null,{limit:1},(err,teamInfo)=>{
															recentinfo.unshift(teamInfo[0]);
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
								console.log('login: get the star information:');
								if(star.length){
									var	starinfo = [];
									star.forEach(starid=>{
										People.find({uid:starid},null,{limit:1},(err,detail)=>{
											starinfo.push(detail[0]);
											if(star.length===starinfo.length){ resolve(starinfo); }
										})
									})
								}else{ resolve([]); }
							}),
							new Promise(function(resolve,rejected){
								console.log('login: get the team information:');
								if(team.length){
									var	teaminfo = [];
									team.forEach(teamId=>{
										Team.find({uid:teamId},null,{limit:1},(err,detail)=>{
											teaminfo.push(detail[0]);
											if(team.length===teaminfo.length){ resolve(teaminfo); }
										})
									})
								}else{ resolve([]) }
							})
						]).then(info=>{
							console.log('login: summary the information');
							var 
								recentinfo = info[0],
								starinfo = info[1],
								teaminfo = info[2];

							var 
								J_user_info = JSON.stringify(user_info),
								J_recentinfo = JSON.stringify(recentinfo),
								J_starinfo = JSON.stringify(starinfo),
								J_teaminfo = JSON.stringify(teaminfo),
								J_punRead = JSON.stringify(punRead);
								J_tunRead = JSON.stringify(tunRead);

							//设置用户登录状态为true
							User.update({uid},{$set:{login:true}},err=>{
								console.log('(user)'+uid+' login');
								//At the same time, make the session login of user true;
								//After login, set a interval to make user logout if user has not any action.
								void function(){
									function makeUserLogout(){
										setTimeout(function(){
											User.find({uid},'login',{limit:1},(err,detail)=>{
												if(detail[0].login){
													User.update({uid},{$set:{login:false}},(err)=>{
														console.log('(user)'+uid+' logout');
														makeUserLogout = null;
													})
												}
												if(makeUserLogout){ makeUserLogout(); };
											})
										// },60000); //1 min;
										},180000); //3 min;
									};
									makeUserLogout();
								}();
								// sess.makeUserSessLogout = setInterval(function(){
								// 	//make user logout every 5 minutes,and user can do any action to relogin.
								// 	console.log('Make (user)'+uid+' logout in session!');
								// 	sess.login = false;
								// },300000);//5min
								
								// sess.makeUserDBLogout = setInterval(function(){
								// 	if(!sess.login){
								// 		User.update({uid},{$set:{login:false}},(err)=>{
								// 			console.log('Make (user)'+uid+' logout in DB!');
								// 			clearInterval(sess.makeUserSessLogout);
								// 			clearInterval(sess.makeUserDBLogout);
								// 			delete sess.login;
								// 		})
								// 	}
								// },1800000)//30min
							});

							res.render('main.ejs',{
								uid,
								punRead:J_punRead,
								tunRead:J_tunRead,
								user_info:J_user_info,
								loginlist:J_loginlist,
								recentinfo:J_recentinfo,
								starinfo:J_starinfo,
								teaminfo:J_teaminfo,
							});
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
	User.update({uid},{$set:{login:false}},(err)=>{ console.log('(user)'+uid+" logoff ↓"); });
	res.render('login.ejs',{ tipInfo:'' });
});

// router.post('/exit',urlencodedParser,(req,res)=>{
// 	var data = JSON.parse(req.body.J_data);
// 	LIB.check(data,'exit');
// 	User.update({uid:data.uid},{$set:{login:false}},(err)=>{
// 		console.log('(user)'+data.uid+" exit ↓↓");
// 		res.send(req.body.J_data);
// 	})
// });

// router.post('/relogin',urlencodedParser,(req,res)=>{
// 	var data = JSON.parse(req.body.J_data);
// 	LIB.check(data,'relogin');
// 	User.update({uid:data.uid},{$set:{login:true}},(err)=>{
// 		console.log('(user)'+data.uid+" relogin ↑↑");
// 		res.send(req.body.J_data);
// 	})
// });

module.exports = router;