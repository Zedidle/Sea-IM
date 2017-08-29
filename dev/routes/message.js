const CHECK = require('../lib/check');
const assert = require('assert');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
const time = require('../lib/retime');
const mongoose=require('mongoose');
const User = require('../mongoModel/user');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Peopleteam = require('../mongoModel/peopleteam');
const StarMark = require('../mongoModel/starMark');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();

//strange message
router.post('/s_send',urlencodedParser,(req,res)=>{
	var sess = req.session,
		data = req.body.data;
	
	sess.s_send = data;
		
	People.find({username:sess.username},(err,detail)=>{
		if(detail.length){
			sess.nickname = detail[0].nickname;
		var mess={
			from:{
				username:sess.username,
				nickname:sess.nickname,
			},
			body:{
				content:data,
				time:time.ytime(),
			},
		}
		Message.update({username:sess.username},{$push:{mess:mess}},(err)=>{})
		}
	})
	res.send(data);
})





router.post('/close_str_mess',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var	data = JSON.parse(req.body.J_data);

	CHECK(data,'data');
	// Message.update({username:data.username},{$pull:{mess:{from.username===data.str_username}}},(err)=>{
	// 	console.log(detail[0])
	// 	console.log('update!')
	// })

	// Message.update({username:data.username},{$pull:{mess:{from:{username:data.str_username}}}}
	// ,{multi:true}
	// ,(err)=>{
	// 		if(err) throw err;
	// 		console.log(111);
	// });
	Message.find({username:data.username},(err,detail)=>{
		var mess = detail[0].mess;
		CHECK(detail[0].mess);
		for(let i=0;i<mess.length;i++){
			if(mess[i].from.username===data.str_username){
				mess.splice(i,1);
				console.log(mess);
			}
		}
	Message.update({username:data.username},{$set:{mess}},err=>{
		if(err) throw err;
	});

	});
});





router.post('/get_star_mess',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);

	CHECK(data,008);
		Message.find({username:data.username},(err,detail)=>{
			if(!detail[0]){
				return;
			}
			var messages = [];
			var m = detail[0].mess;
			var i=m.length-1;
			while(messages.length<7&&messages.length<m.length&&i>=0){
				if(m[i].from.username===data.star_username){
					messages.unshift(m[i]);
				}
				i=i-1;
			}
		res.send(messages);

		})
})

router.post('/get_team_mess',urlencodedParser,(req,res)=>{
	var sess = req.session,
		id = req.body.data;
		console.log(req.body.data);
		console.log(id);
		Tmessage.find({id},(err,detail)=>{
			var mess = detail[0].mess,
				messages=[];
			while(messages.length<50&&mess.length>0){
				messages.unshift(mess.pop())
			}
			var J_messages = JSON.stringify(messages);
			res.send(J_messages);
		})
})


module.exports = router;