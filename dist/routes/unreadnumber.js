const CHECK = require('./lib/check');
const assert = require('assert');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
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

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();












router.post('/test',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'test');
	var J_data = JSON.stringify({
		answer:'finish to test',
	});
	res.send(J_data);
})














router.post('/dealwithunread',urlencodedParser,(req,res)=>{
	var sess = req.sesstion;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'detalwithunread');
	CHECK(data.checked,'checked:');
	// data = {
	// 	type:string,
	// 	uid:string,
	// 	to:string,
	// 	checked:boolean,
	// }
	//data.uid is the host of this msg, the mean is who send the msg.
	Unread.find({uid:data.to},(err,detail)=>{
		var u;
		if(data.type!=='team'){
			u = detail[0].punReadNumber;
			if(!u[data.uid]){ u[data.uid]=0; };
			if(data.checked){
				u[data.uid] = '';
			}else{
				u[data.uid] += 1;
			}
			Unread.update({uid:data.to},{$set:{punReadNumber:u}},(err)=>{});
		}else{
			u = detail[0].tunReadNumber;
			if(!u[data.uid]){ u[data.uid]=0; };
			if(data.checked){
				u[data.uid] = '';
			}else{
				u[data.uid] += 1;
			}
			Unread.update({uid:data.to},{$set:{tunReadNumber:u}},(err)=>{});
		}
		console.log(data.to + ' unread update!');
	})
});




router.post('/justGetInfo',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'justGetInfo');

	if(data.type==='team'){
		Team.find({uid:data.uid},(err,detail)=>{
			res.send(detail[0]);
		})
	}else{
		People.find({uid:data.uid},(err,detail)=>{
			res.send(detail[0]);
		})
	}
})






router.post('/getMoreinfo',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'getMoreinfo');
	var 
		type = data.type,
		check_uid = data.check_uid;

	if(type==='team'){
		Team.find({uid:check_uid},(err,detail)=>{
			CHECK(detail[0],'getMoreTeaminfo');
			res.send(detail[0]);
		})
	}else{
		People.find({uid:check_uid},(err,detail)=>{
			CHECK(detail[0],'getMorePeopleinfo');
			res.send(detail[0]);
		})
	}


})



router.post('/getUnreadMess',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'getUnreadMess');
	var unrN = data.unreadNumber;
	if(data.type==='team'){
		Tmessage.find({uid:data.get_uid},(err,detail)=>{
			CHECK(detail[0],'getUnread_team_mess');
			var m = detail[0].mess;
			var mess = [];
			while(unrN){
				mess.unshift(m.pop());
				unrN = unrN-1;
			}
			res.send(mess);
		})
	}else{
		Message.find({uid:data.uid},(err,detail)=>{
			CHECK(detail[0],'getUnread_people_mess');
			var mf = detail[0].mess[data.get_uid];
			var mess = [];
			while(unrN){
				mess.unshift(mf.pop());
				unrN = unrN-1;
			}
			res.send(mess);
		})
	}

})


module.exports = router;
