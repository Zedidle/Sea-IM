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
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();


router.post('/main',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var uid = req.body.uid;
	CHECK(uid,'main_uid');
	//login too
	new Promise((resolve,reject)=>{
		//Get the information of this user,
		People.find({uid},(err,peopleInfo)=>{
			if(!sess.info){ sess.info={}; }
			sess.info[uid] = peopleInfo[0];
			//Get the punReadNumber and tunReadNumber for this user,  
			Unread.find({uid},(err,unread)=>{
				resolve({
					user_info:sess.info[uid],
					unread:unread[0],
					// punReadNumber:unread[0].punReadNumber,
					// tunReadNumber:unread[0].tunReadNumber,
				});
			})
		});
	}).then((userinfoAndUnread)=>{

		var 
			user_info = userinfoAndUnread.user_info,
			punReadNumber = userinfoAndUnread.unread.punReadNumber,
			tunReadNumber = userinfoAndUnread.unread.tunReadNumber;
			CHECK(user_info,'user_info');

			//Get the links of communication about this user,
	Loginlist.find({uid},(err,detail)=>{
		let loginlist = JSON.stringify(detail[0]);

		CHECK(detail[0],"loginlist");
		var 
			recent_people = detail[0].recent.people,
			recent_team = detail[0].recent.team,
			star = detail[0].star,
			team = detail[0].team;

			CHECK(recent_people,"recent_poeple");
			CHECK(recent_team,"recent_team");

var getinfo = Promise.all([
	//Get the recent list's people and team's information
	new Promise(function(resolve,rejected){
			console.log("recent_people.length: "+recent_people.length);
			console.log("recent_team.length: "+recent_team.length);
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
		
		var 
			recentinfo = info[0],
			starinfo = info[1],
			teaminfo = info[2];

			CHECK(recentinfo,"recentinfo");
		var 
			J_user_info = JSON.stringify(user_info),
			J_recentinfo = JSON.stringify(recentinfo),
			J_starinfo = JSON.stringify(starinfo),
			J_teaminfo = JSON.stringify(teaminfo),
			J_punReadNumber = JSON.stringify(punReadNumber);
			J_tunReadNumber = JSON.stringify(tunReadNumber);

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
	//login too
	
})





module.exports = router;  