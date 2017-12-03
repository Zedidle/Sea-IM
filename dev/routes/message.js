const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'dist/public/img/uploads/' });
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


//used by public/js/main.js g370;
router.post('/getmess',urlencodedParser,(req,res)=>{

	var data = JSON.parse(req.body.J_data);
	console.log(data);
	var receive_uid = data.receive_uid;
	var from_uid = data.from_uid;
	var type = data.type;
	var skip = data.getTimes * 5;
	var msend = [];
	var getMessNumber = 5;

	new Promise((resolve,reject)=>{
		if(type!=='team'){
			Message.find({uid:receive_uid},null,null,(err,detail)=>{
				LIB.check(detail[0],'getmess_NotTeam');
				resolve(detail[0]['mess'][from_uid]);
			});
		}else{
			Tmessage.find({uid:from_uid},(err,detail)=>{
				LIB.check(detail[0],'getmess_Team');
				resolve(detail[0].mess);
			});
		}
	}).then(gotMessages=>{
		var l = gotMessages.length;
		console.log('gotMessages.length:'+l);
		for(let i=0;gotMessages.length&&i<5;i++){
			msend.push(gotMessages[l-skip-1-i]);
		}
		console.log('msend:');
		console.log(msend);
		var J_msend = JSON.stringify(msend);
		res.send(J_msend);
	})
})



// router.post('/getmess',urlencodedParser,(req,res)=>{

// 	var data = JSON.parse(req.body.J_data);
// 	// LIB.userRelogin(User,data.uid);
//     LIB.check(data,'Get mess : ');
// 	var gotMessages;
// 	var msend = { isteam:null, mess:[],};
// 	var getMessNumber = data.unRead;

// 	new Promise((resolve,reject)=>{
// 		if(data.type!=='team'){
// 			Message.find({uid:data.uid},null,{limit:1},(err,detail)=>{
// 				LIB.check(detail[0],'getmess_NotTeam');
// 				gotMessages = detail[0]['mess'][data.mid];
// 				msend.isteam = false;
// 				resolve(gotMessages);
// 			});
// 		}else{
// 			Tmessage.find({uid:data.mid},null,{limit:1},(err,detail)=>{
// 				LIB.check(detail[0],'getmess_Team');
// 				gotMessages = detail[0].mess;
// 				msend.isteam = true;
// 				resolve(gotMessages);
// 			});
// 		}
// 	}).then(gotMessages=>{
// 		while(getMessNumber&&gotMessages.length){
// 			msend.mess.unshift(gotMessages.pop());
// 			getMessNumber -= 1;
// 		}
// 		var J_msend = JSON.stringify(msend);
// 		res.send(J_msend);
// 	})
// })

module.exports = router;