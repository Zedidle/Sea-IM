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
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();



//Start
router.get('/',(req,res)=>{
	res.render('login.ejs', { tipInfo:'' })
})

//Register
router.get('/regist',(req,res)=>{
	res.render('regist.ejs',{
		tipuid:'',
	});
})

router.post('/registInfo', urlencodedParser, (req,res)=>{

	var hash = crypto.createHash('sha1');
	hash.update(req.body.password)
	var password = hash.digest('hex');

	var uid = req.body.uid, UN = { uid };

	var user = new User({ uid, password });

	var people = new People({
		uid,
		headImg:'/img/defaultHead.jpg',
		sex : '保密',
    name : '未命名',
    introduce:'这家伙很懒,什么也没有写．',
    hobby : '保密',
    birthday : '保密',
	});
	var loginlist = new Loginlist({
		uid, 
		recent:[],
		star:[],
		team:[],
		stranger:[],
	});
	var message = new Message({
		uid,
		unReadNumber:{'0':'0'},
		TunReadNumber:{'0':'0'},
		mess:{'0':'0'},
	});

	new Promise((resolve)=>{
		var tipUN;
		User.find(UN,(err, detail)=>{
		(detail.length===0)?tipUN=false:tipUN=true;
		resolve(tipUN);
	});
  	}).then((tipUN)=>{

		if(tipUN){
			res.render('regist.ejs',{
				tipuid:'uid exist',
			});
		}else{
			user.save((err)=>{
				res.render('registInfo.ejs', { tipInfo:'Register successfully！' })
			})
			people.save();
			loginlist.save();
			message.save();
		}
	});
});



//Loginnnn
router.post('/', urlencodedParser,(req,res)=>{
	var hash = crypto.createHash('sha1');
	var sess = req.session;
	var uid = req.body.uid;
	
	hash.update(req.body.password);
	var password = hash.digest('hex');

	User.find({uid,password},(err,detail)=>{
		if(!detail.length){
			res.render('login.ejs',{ tipInfo:"Uid doesn't exist or password error！", })
			return false;
		}
		
		if(!sess.login_users){ sess.login_users = {} }
		if(!sess.living_number){ sess.living_number = 1;  }
		else{ sess.living_number+=1; }
		console.log('User '+uid+' login.');
		console.log('Living number: '+sess.living_number);

//main too
	new Promise((resolve,reject)=>{
		if(!sess.info){ sess.info = {}; }
		if(sess.info[uid]){ resolve(sess.info[uid]); }
		else{
			People.find({uid},(err,detail1)=>{
				if(!sess.info){ sess.info={}; }
				sess.info[uid] = detail1[0];
				Message.find({uid},(err,detail2)=>{
					// resolve(sess.info[uid]);
					console.log(601)
					console.log(detail2[0]);
					var unReadNumber = detail2[0].unReadNumber;
					var TunReadNumber = detail2[0].TunReadNumber;
					console.log(602)
					CHECK(unReadNumber,'unR')
					CHECK(TunReadNumber,'TunR')
					var info = {
						user_info:sess.info[uid],
						unReadNumber,
						TunReadNumber,
					}
					resolve(info);
				})
			});
		}
	}).then((info)=>{

		var 
			user_info = info.user_info,
			unReadNumber=info.unReadNumber,
			TunReadNumber = info.TunReadNumber;
			console.log(603)
			CHECK(user_info,'user_info')
			CHECK(unReadNumber,'unR')
			CHECK(TunReadNumber,'TunR')

	Loginlist.find({uid},(err,detail)=>{
		console.log(604)
		let loginlist = JSON.stringify(detail[0]);
		var 
			recent = detail[0].recent,
			star = detail[0].star,
			team = detail[0].team,
			stranger = detail[0].stranger;

var getinfo = Promise.all([
	new Promise(function(resolve,rejected){
	if(recent.length){
		var recentinfo = [];
	recent.forEach(a=>{
		People.find({uid:a},(err,detail)=>{
			detail[0].unReadNumber = unReadNumber[a];
			recentinfo.push(detail[0]);
			if(recent.length===recentinfo.length){ resolve(recentinfo) }
		})
	})
	}else{ resolve([]) };
	}),
	new Promise(function(resolve,rejected){
	if(star.length){
		var	starinfo = [];
	star.forEach(a=>{
		People.find({uid:a},(err,detail)=>{
			detail[0].unReadNumber = unReadNumber[a];
			starinfo.push(detail[0]);
			if(star.length===starinfo.length){ resolve(starinfo) }
		})
	})
	}else{ resolve([]) }
	}),	
	new Promise(function(resolve,rejected){
	if(team.length){
		var	teaminfo = [];
	team.forEach(a=>{
		Team.find({uid:a},(err,detail)=>{
			detail[0].unReadNumber = TunReadNumber[a];
			teaminfo.push(detail[0]);
			if(team.length===teaminfo.length){ resolve(teaminfo) }
		})
	})
	}else{ resolve([]) }
	}),
	new Promise(function(resolve,rejected){

	if(stranger.length){
		var	strangerinfo = [];
	stranger.forEach(a=>{
		People.find({uid:a},(err,detail)=>{
			detail[0].unReadNumber = unReadNumber[a];
			strangerinfo.push(detail[0]);
			if(stranger.length===strangerinfo.length){ resolve(strangerinfo) }
		})
	})
	}else{ resolve([])}
	})
	]).then(info=>{ 
		console.log(605)
		
		var 
			recentinfo = info[0],
			starinfo = info[1],
			teaminfo = info[2],
			strangerinfo = info[3];

		var 
			J_user_info = JSON.stringify(user_info),
			J_recentinfo = JSON.stringify(recentinfo),
			J_starinfo = JSON.stringify(starinfo),
			J_teaminfo = JSON.stringify(teaminfo),
			J_strangerinfo = JSON.stringify(strangerinfo);

console.log(606)
		res.render('main.ejs',{
			uid,
			user_info:J_user_info,
			loginlist,
			recentinfo:J_recentinfo,
			starinfo:J_starinfo,
			teaminfo:J_teaminfo,
			strangerinfo:J_strangerinfo,
		})
		
	});

	})



	})

//main too
	})
	})




router.get('/logOff',(req,res)=>{
	var sess = req.session;
	sess.living_number -= 1;
	console.log('Living number: '+sess.living_number);
	res.render('login.ejs',{tipInfo:''})
})

module.exports = router;