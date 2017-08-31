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

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const router = express.Router();


router.post('/search',urlencodedParser,(req,res)=>{
	var sess = req.session,
		data = JSON.parse(req.body.J_data),
		d = {};
        
        CHECK(data);
        if(!sess.tpid){
        	sess.tpid = {};
        }
	    sess.tpid[data.username] = data.id;

		Team.find({id:data.id},(err,detail)=>{
			detail.length?d.team = detail[0]:d.team = '';
		People.find({username:data.id},(err,detail)=>{
			detail.length?d.person=detail[0]:d.person = '';
		console.log(d);
		res.send(d);
		});
		});
});


router.post('/join_judge',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);

	Peopleteam.find({username:data.username},(err,detail)=>{

	var jointeams = detail[0].join;
	var judge='ok';

		if(detail[0].join.length<3){
			for(var jointeam of jointeams){
				if(jointeam===data.id){
					judge = 'You had already joined.';
					break;
				}
			}
		}else{
			judge = 'Most 3 teams.';
		}

	res.send(judge);

	});
});

router.post('/join',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	res.render('afterL/join.ejs',{
		username:data.username,
		id:data.id,
	});

});


router.post('/join_ok',urlencodedParser,(req,res)=>{
	var sess = req.sesstion;
	var data = JSON.parse(req.body.J_data);

	CHECK(data);
	Team.find({id:data.id,password:data.password},(err,detail)=>{
		CHECK(detail[0]);
		if(detail[0]){
			console.log(602)
			Team.update({id:data.id},{$inc:{membernumber:1},$push:{member:data.username}},(err)=>{
				if(err) throw err;
			Peopleteam.update({username:data.username},{$push:{join:data.id}},(err)=>{
				if(err) throw err;
				res.send(true);
			});
			});
		}else{
			console.log(603)
			res.send(false);
		}
	});
});


//star
router.post('/star',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	var id = sess.tpid[data.username]||data.id;
	StarMark.find({username:data.username},(err,detail)=>{
		var stars = detail[0].stars;
		for(let i of stars){
			if(i===id){
				res.send(false)
				return;
			}
		}
	StarMark.update({username:data.username},{$push:{stars:id}},(err)=>{
		if(err) throw err;
		// res.send(true);
	People.find({username:id},(err,detail)=>{
		if(err) throw err;
		CHECK(detail[0],9527);
		var data = {
			nickname:detail[0].nickname,
			username:detail[0].username,
			headImg:detail[0].headImg,
			introduce:detail[0].introduce
		}
		var J_data = JSON.stringify(data);
		res.send(J_data);
	});
	});
	});

});



//message on search
router.post('/mess',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'mess')


	People.find({username:sess.tpid[data.username]},(err,detail)=>{
		if(detail.length){
			var mess={
				from:{
					username:data.username,
					nickname:detail[0].nickname,
				},
				body:{
					content:data.message,
					time:time.ytime(),
				},
			}
	Message.update({username:data.to},{$push:{mess}},(err)=>{
		res.send('Send!.')
	});
		}else{
			res.send('Failure!')
		}

	});

});





module.exports = router;