const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
const mongoose=require('mongoose');
const User = require('../../model/user');
const Unread = require('../../model/unread');
const Message = require('../../model/message');
const Tmessage = require('../../model/tmessage');
const People = require('../../model/people');
const Team = require('../../model/team');
const Loginlist = require('../../model/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();


router.post('/main',urlencodedParser,(req,res)=>{
	var uid = req.body.uid;
	LIB.check(uid,'main_uid');
	//login too
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
			recent_people.forEach(a=>{
				People.find({uid:a},(err,peopleInfo)=>{
					recentinfo.push(peopleInfo[0]);
					if(recentinfo.length===recent_people.length){
						if(recentinfo.length === total_length){
							resolve(recentinfo);
						}else{
							recent_team.forEach(b=>{
								Team.find({uid:b},(err,teamInfo)=>{
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
			star.forEach(a=>{
				People.find({uid:a},(err,detail)=>{
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
			},60000); //1 min;
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
		})
	});
	});
	});
	//login too
	
})





module.exports = router;  