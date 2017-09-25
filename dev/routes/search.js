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
const Loginlist = require('../mongoModel/loginlist');


const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const router = express.Router();


router.post('/search',urlencodedParser,(req,res)=>{
	var 
		sess = req.session,
		data = JSON.parse(req.body.J_data),
		d = {};

  CHECK(data,'search');

	Team.find({uid:data.uid},(err,detail)=>{
		detail.length?d.team = detail[0]:d.team = '';
	People.find({uid:data.uid},(err,detail)=>{
		detail.length?d.person=detail[0]:d.person = '';
		res.send(d);
	});
	});
});


router.post('/join_judge',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'join_judge')

	Loginlist.find({uid:data.uid},(err,detail)=>{
		var judge='ok';
		CHECK(detail[0],'join_judge_Loginlist')
		if(detail[0].team.length<4){
			for(var j of detail[0].team){
				if(j===data.tuid){
					judge = 'You had already joined.';
					break;
				}
			}
		}else{
			judge = 'Most 4 teams.';
		}
		res.send(judge);
	});
});

router.post('/join',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	CHECK(data,'join')
	res.render('afterL/join.ejs',{ uid:data.uid, tid:data.tid, });
});


router.post('/join_ok',urlencodedParser,(req,res)=>{
	var sess = req.sesstion;
	var data = JSON.parse(req.body.J_data);

	CHECK(data,'join_ok');
	Team.find({uid:data.tid,password:data.password},(err,detail)=>{
		if(detail[0]){
			Team.update({uid:data.tid},{$inc:{membernumber:1},$push:{member:data.uid}},(err)=>{
			Loginlist.update({uid:data.uid},{$push:{team:data.tid}},(err)=>{
				res.send(true);
			});
			});
		}else{
			res.send(false);
		}
	});
});


//star
router.post('/star',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'star check ok?')
	Loginlist.find({uid:data.uid},(err,detail)=>{
		for(let i of detail[0].star){
			if(i===data.sid){ res.send(false); return false; }
		}
	Loginlist.update({uid:data.uid},{$push:{star:data.sid}},(err)=>{
		People.find({uid:data.sid},(err,detail)=>{
			CHECK(detail[0],'star_people');
			var J_data = JSON.stringify(detail[0]);
			res.send(J_data);
			Message.find({uid:data.uid},(err,detail)=>{
				CHECK(detail[0],'star_message');
				var unReadNumber = detail[0]['unReadNumber'];
				if(!unReadNumber[data.sid]){
			 	  unReadNumber[data.sid] = 0;
					Message.update({uid:data.uid},{$set:{unReadNumber}},(err)=>{});
				}
			})
		});
	});
	});
});

//message on search
router.post('/mess',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'mess')

	People.find({uid:sess.tpid[data.uid]},(err,detail)=>{
		if(detail.length){
			var mess={
				from:{
					uid:data.uid,
					name:detail[0].name,
				},
				body:{
					content:data.message,
					time:time.ytime(),
				},
			}
	Message.update({uid:data.to},{$push:{mess}},(err)=>{
		res.send('Send!.')
	});
		}else{
			res.send('Failure!')
		}

	});

});





module.exports = router;