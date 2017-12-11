const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'dist/public/img/uploads/' });
const User = require('../model/user');
const Unread = require('../model/unread');
const Message = require('../model/message');
const Tmessage = require('../model/tmessage');
const People = require('../model/people');
const Team = require('../model/team');
const Loginlist = require('../model/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();


//start: login page,
router.get('/',(req,res)=>{ 
	res.render('login.ejs', { tipInfo:'' }); 
});

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
				headImg:'/img/defaultHead.png',
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
		if(detail[0]&&detail[0].login){
			console.log('(user)'+uid+" had already logined!");
			res.render('login.ejs',{ tipInfo:"系统忙，请稍后登录！",  });
		}else{
			User.find({uid,password:pwd},null,{ limit : 1 },(err,detail)=>{
				if(!detail[0]){
					res.render('login.ejs',{ tipInfo:"用户名不存在或密码错误！", });
				}else{

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
							res.render('main.ejs',{
								uid,
								punRead:JSON.stringify(punRead),
								tunRead:JSON.stringify(tunRead),
								user_info:JSON.stringify(user_info),
								loginlist:J_loginlist,
								recentinfo:JSON.stringify(info[0]),
								starinfo:JSON.stringify(info[1]),
								teaminfo:JSON.stringify(info[2]),
							});
							//make login status of user true;
							User.update({uid},{$set:{login:true}},err=>{
								console.log('(user)'+uid+' login');
								setTimeout(function(){
									User.update({uid},{$set:{login:false}},err=>{ console.log(uid + ' logout'); });
								},9000);
							});
						});
					});
				});
//main too
				}
			});
		}
	})
});



router.post('/logOff',urlencodedParser,(req,res)=>{
	var uid = req.body.uid;
	User.update({uid},{$set:{login:false}},(err)=>{ 
		console.log('(user)'+uid+" logoff ↓");
	});
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