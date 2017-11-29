const LIB = require('./lib');
const assert = require('assert');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
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
	LIB.check(data,'test');
	var J_data = JSON.stringify({
		answer:'finish to test',
	});
	res.send(J_data);
})


//used by public/js/main.js g387
router.post('/dealwithunread',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'deal with unread:');

	//data.uid is the host of this message who send the msg.
	Unread.find({uid:data.to},null,{limit:1},(err,detail)=>{
		//judge if typeof the data is team, 
		if(data.type!=='team'){
			var _unread = detail[0].punRead;
			if(!_unread[data.uid]){ _unread[data.uid]=0; };
			_unread[data.uid] = data.checked?'':_unread[data.uid]+1;
			Unread.update({uid:data.to},{$set:{punRead:_unread}},(err)=>{});
		}else{
			var _unread = detail[0].tunRead;
			if(!_unread[data.uid]){ _unread[data.uid]=0; };
			_unread[data.uid] = data.checked?'':_unread[data.uid]+1;
			Unread.update({uid:data.to},{$set:{tunRead:_unread}},(err)=>{});
		}
	})
});



//used by public/js/main.js g629,
router.post('/justGetInfo',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'the information of the user:');
	if(data.type==='team'){
		Team.find({uid:data.uid},null,{limit:1},(err,detail)=>{ res.send(detail[0]); });
	}else{
		People.find({uid:data.uid},null,{limit:1},(err,detail)=>{ res.send(detail[0]); });
	}
})


//used by public/js/main.js g451,
router.post('/getMoreinfo',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data,'getMoreinfo');
	var check_uid = data.check_uid;
	if(data.type==='team'){
		Team.find({uid:check_uid},null,{limit:1},(err,detail)=>{ res.send(detail[0]); });
	}else{
		People.find({uid:check_uid},null,{limit:1},(err,detail)=>{ res.send(detail[0]); });
	}
})


//used by public/js/main.js g584,
router.post('/getUnreadMess',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
	LIB.check(data.mess,data.uid+'get unread messages:');
	var unrN = data.unreadNumber;
	var mess = [];
	if(data.type==='team'){
		Tmessage.find({uid:data.get_uid},null,{limit:1},(err,detail)=>{
			LIB.check(detail[0],'get unread messages of team');
			var m = detail[0].mess;
			while(unrN&&m){
				mess.unshift(m.pop());
				unrN -= 1;
			}
			res.send(mess);
		})
	}else{
		Message.find({uid:data.uid},null,{limit:1},(err,detail)=>{
			LIB.check(detail[0],'get unread messages of people: ');
			var mf = detail[0].mess[data.get_uid];
			while(unrN&&mf){
				mess.unshift(mf.pop());
				unrN -= 1;
			}
			res.send(mess);
		})
	}
})


module.exports = router;
