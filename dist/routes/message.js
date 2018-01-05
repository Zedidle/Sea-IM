const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
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
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();

router.post('/getmess',urlencodedParser,(req,res)=>{
	var data = req.body;
	new Promise((resolve,reject)=>{
		if(data.type!=='team'){
			Message.find({uid:data.receive_uid}, null, {limit:1}, (err,mess) => {
				if(err) throw err;
				if(mess.length){
					resolve(mess[0]['mess'][data.from_uid]);
				}else{
					resolve(false);
				}
			});
		}else{
			Tmessage.find({uid:data.from_uid}, null, {limit:1}, (err,tmess) => {
				if(err) throw err;
				if(tmess.length){
					resolve(tmess[0].mess);
				}else{
					resolve(false);
				}
			});
		}
	}).then((messages) => {
		res.send(messages);
	});
});

router.post('/starOrUnstar', urlencodedParser, (req,res) => {
	var data = JSON.parse(req.body.J_data);
	if(data.isStar){
		Loginlist.update({uid:data.uid}, {$pull:{star:data.to}}, (err) => {
			res.send(false);
		})
	}else{
		Loginlist.update({uid:data.uid}, {$addToSet:{star:data.to}}, (err) => {
			People.find({uid:data.to}, null, {limit:1}, (err,detail) => {
				res.send(detail[0]);
			})
		})
	}
})

router.post('/deleteRecentChat', urlencodedParser, (req,res) => {
	var data = JSON.parse(req.body.J_data);
	Loginlist.update({uid:data.uid}, {$pull:{recent_people:data.to}},(err) => {
		console.log(666);
	})
	res.send(true);
})

module.exports = router;