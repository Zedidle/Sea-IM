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
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const router = express.Router();


//used by public/js/main.js g118,
router.post('/search',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
  	LIB.check(data,'search:');
	var info = {};
  	//get the information of the user and the team for search,
	Team.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		info.team = detail.length?detail[0]:'';
		People.find({uid:data.uid},null,{limit:1},(err,detail)=>{
			info.person = detail.length?detail[0]:'';
			res.send(info);
		});
	});
});

//used by public/js/main.js g175,
//if a person choice to join a team, must pass this part,
router.post('/join_judge',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'to judge whether the person could join the team:')

	Loginlist.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var judge='ok';
		LIB.check(detail[0].team,'the teams that the user has joined in:');
		if(detail[0].team.length<4){
			for(var teamid of detail[0].team){
				if(teamid===data.tid){ judge = 'You had already joined.'; break; }
			}
		}else{
			judge = 'You can just join four teams mostly.';
		}
		res.send(judge);
	});
});


//used by public/js/main.js g177,
router.post('/join',urlencodedParser,(req,res)=>{
	var data = req.body;
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'join:');
	res.render('join.ejs',{ uid:data.uid, tid:data.tid, });
});


// used by views/join.ejs g68, 
router.post('/join_ok',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'ok to join:');
	Team.find({uid:data.tid},null,{limit:1},(err,detail)=>{
		if(detail[0].password===data.password){
			Team.update({uid:data.tid},{$inc:{membernumber:1},$push:{member:data.uid}},(err)=>{
				Message.find({uid:data.uid},null,{limit:1},(err,detail)=>{
					var tunRead = detail[0]['tunRead'];
					LIB.check(tunRead,'search the team and join it successfully:')
					tunRead[data.tid] = 0;
					Message.update({uid:data.uid},{$set:{tunRead}},(err)=>{});
				});
				Loginlist.update({uid:data.uid},{$push:{team:data.tid}},(err)=>{});
				res.send(true); 
			});
		}else{
			res.send(false);
		}
	});
});

//used by public/js/main.js g173,
router.post('/star',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'star check:');
	//update the loginlist of the user,
	Loginlist.update({uid:data.uid},{$addToSet:{star:data.sid}},(err)=>{});
	//update the unread of the user in recent,
	Unread.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var punRead = detail[0].punRead;
		//judge if punRead has id of the star for recent list,
		if(!punRead[data.sid]){ 
			punRead[data.sid] = 0;
			Unread.update({uid:data.uid},{$set:{punRead}},err=>{});
		};
	});
	//get the information of the star,and send to the page,
	People.find({uid:data.sid},null,{limit:1},(err,detail)=>{
		LIB.check(detail[0],'the information of the star:');
		var J_data = JSON.stringify(detail[0]);
		//the J_data for render in main.ejs, add star information to the star list immediately,
		res.send(J_data);
	});
});


module.exports = router;