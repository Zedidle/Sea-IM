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
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const loginlist = require('../mongoModel/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();





router.post('/getmess',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);

	// data = {
	// 	type:string,
	// 	uid:string,
	// 	mid:string,
	// 	unReadNumber:number,
	// }
	// var m = {
 //        uid:msg.from,
 //        type:msg.type,
 //        headImg:detail[0].headImg,
 //        name:detail[0].name,
 //        time:msg.time,
 //        content:msg.content,
 //      },
      
	var 
		mget, 
		msend={
			isteam:'',
			mess:[],
		},
		getMessNumber;

(data.unReadNumber>20)?getMessNumber = data.unReadNumber:getMessNumber = 20;

new Promise((resolve,reject)=>{
	if(data.type!=='team'){
		Message.find({uid:data.uid},(err,detail)=>{
			CHECK(detail[0],'getmess_NotTeam');
			mget = detail[0]['mess'][data.mid];
			msend.isteam = false;
			resolve(mget);
		})
	}else{
		Tmessage.find({uid:data.mid},(err,detail)=>{
			CHECK(detail[0],'getmess_Team');
			mget = detail[0].mess;
			msend.isteam = true;
			resolve(mget);
		})
	}
}).then(mget=>{
	while(getMessNumber&&mget.length){
		msend.mess.unshift(mget.pop());
		getMessNumber -= 1;
	}
	var J_msend = JSON.stringify(msend);
	res.send(J_msend);
})

})


module.exports = router;