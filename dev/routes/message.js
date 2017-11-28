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
const mongoose=require('mongoose');
const User = require('../mongoModel/user');
const Unread = require('../mongoModel/unread');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const loginlist = require('../mongoModel/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();


//used by unkown,
router.post('/getmess',urlencodedParser,(req,res)=>{

	var data = JSON.parse(req.body.J_data);
	LIB.userRelogin(User,data.uid);
    LIB.check(data,'Get mess : ');
	var getMessages;
	var msend = { isteam:false, mess:[],};
	var getMessNumber = data.unRead;

	new Promise((resolve,reject)=>{
		if(data.type!=='team'){
			Message.find({uid:data.uid},null,{limit:1},(err,detail)=>{
				LIB.check(detail[0],'getmess_NotTeam');
				getMessages = detail[0]['mess'][data.mid];
				msend.isteam = false;
				resolve(getMessages);
			});
		}else{
			Tmessage.find({uid:data.mid},null,{limit:1},(err,detail)=>{
				LIB.check(detail[0],'getmess_Team');
				getMessages = detail[0].mess;
				msend.isteam = true;
				resolve(getMessages);
			});
		}
	}).then(getMessages=>{
		while(getMessNumber&&getMessages.length){
			msend.mess.unshift(getMessages.pop());
			getMessNumber -= 1;
		}
		var J_msend = JSON.stringify(msend);
		res.send(J_msend);
	})
})

module.exports = router;