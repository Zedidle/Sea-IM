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
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');


router.post('/unreadnumber',urlencodedParser,(req,res)=>{
	var sess = req.sesstion;
	var data = JSON.parse(req.body.J_data);

	// data = {
	// 	type:string,
	// 	uid:string,
	// 	mid:string,
	// 	checked:boolean,
	// }

	Message.find({uid:data.uid},(err,detail)=>{
		var u;
		if(data.type!=='team'){
			u = detail[0].unReadNumber;
			if(data.checked){
				u[data.mid] = 0;
			}else{
				u[data.mid] += 1;
			}
			Message.update({uid:data.uid},{$set:{unReadNumber:u}},(err)=>{});
		}else{
			u = detail[0].TunReadNumber;
			if(data.checked){
				u[data.mid] = 0;
			}else{
				u[data.mid] += 1;
			}
			Message.update({uid:data.uid},{$set:{TunReadNumber:u}},(err)=>{});
		}
		res.send(true)
	})

});