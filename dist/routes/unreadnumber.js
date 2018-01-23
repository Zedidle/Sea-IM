const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'dist/public/img/uploads/' });
const User = require('../model/user');
const Unread = require('../model/unread');
const Message = require('../model/message');
const Tmessage = require('../model/tmessage');
const People = require('../model/people');
const Team = require('../model/team');
const Loginlist = require('../model/loginlist');

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


//used by public/js/main-method.js
router.post('/unReadTo0', urlencodedParser, (req, res) => {
	var uid = req.body.uid;
	var to = req.body.to;
	var type = req.body.type;

	//处理用户的未读消息数
	Unread.find({ uid }, null, {limit:1}, (err, u) => {
		var unread;
		//根据不同的类型做出不同的处理
		if(type!=='team'){
			unread = u[0].punRead;
			unread[to] = 0;
			Unread.update({ uid }, {$set:{punRead:unread}}, (err)=>{});
		}else{
			unread = u[0].tunRead;
			unread[to] = 0;
			Unread.update({ uid }, {$set:{tunRead:unread}}, (err)=>{});
		}
	});
});

router.post('/unReadAdd1', urlencodedParser, (req, res) => {
	

});



//used by public/js/main.js,
router.get('/getUnreadMess', (req,res) => {
	var data = req.query;
	var unread = parseInt(data.unread);
	var mess = [];

	if(!unread){
		res.send(mess);
	}
	console.log(data);

	if(data.type==='team'){
		Tmessage.find(
			{
				uid:data.getUid
			},
			null,
			{	
				limit:1
			},
			function(err,detail){
				if(err) throw err;
				var m = detail[0].mess;
				while(unread&&m){
					mess.unshift(m.pop());
					unread--;
				}
				res.send(mess);
			}
		);
	}else{
		Message.find(
			{
				uid:data.uid
			},
			null,
			{
				limit:1
			},
			function(err,detail){
				if(err) throw err;
				console.log(detail);
				var mf = detail[0].mess[data.getUid];
				while(unread&&mf){
					mess.unshift(mf.pop());
					unread--;
				}
				res.send(mess);
			}
		);
	}
})


module.exports = router;
