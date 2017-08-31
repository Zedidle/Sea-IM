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



//Start
router.get('/',(req,res)=>{
	res.render('login.ejs', { tipInfo:'' })
})

//Register
router.get('/regist',(req,res)=>{
	res.render('regist.ejs',{
		tipUserName:'',
		tipEmail:''
	});
})

router.post('/registInfo', urlencodedParser, (req,res)=>{


	console.log(req.body);

	var hash = crypto.createHash('sha1');
	hash.update(req.body.password)
	var password = hash.digest('hex');

	var username = req.body.username,
		UN = { username },
    	EM = { email:req.body.email };

	var user = new User({
		username,
		password,
		email:req.body.email
		});
	var people = new People({
		username,
		headImg:'/img/defaultHead.jpg',
		sex : '保密',
    	nickname : '未命名',
    	introduce:'这家伙很懒,没写简介．',
    	hobby : '保密',
    	birthday : '保密',
		});
	var starmark = new StarMark({
		username,
		stars: [],
	})
	var message = new Message({
		username,
		mess:[],
		});
	var peopleteam = new Peopleteam({
		username,
		build:'',
		join:[],
		});

  	new Promise((resolve)=>{
  		var tip = {};
  		User.find(UN,(err, detail)=>{
			(detail.length===0)?tip.UN=false:tip.UN=true;
		User.find(EM,(err,detail)=>{
			(detail.length===0)?tip.EM=false:tip.EM=true;
			resolve(tip);
		})
		});
  	}).then((tip)=>{
		if(tip.UN||tip.EM){
			res.render('regist.ejs',{
				tipUserName:tip.UN?'username exist':'',
				tipEmail:tip.EM?'email is be used':'',
			});
		}else{
			user.save((err)=>{
				res.render('registInfo.ejs', {
					tipInfo:'Register successfully！'
				})
				people.save();
				starmark.save();
				message.save();
				peopleteam.save();
			})
		}
	});
});




//Loginnnn
router.post('/', urlencodedParser,(req,res)=>{
	var hash = crypto.createHash('sha1');
	var sess = req.session;
	var username = req.body.username;
	
	hash.update(req.body.password);
	var password = hash.digest('hex');
	var check = {
		username,
		password,
	};

	User.find(check,(err,detail)=>{
		if(detail.length){
			if(!sess.email){
				sess.email = {};
			}
			sess.email[username] = detail[0].email;
		}else{
			res.render('login.ejs',{
				tipInfo:"Username doesn't exist or password error！",
			})
			return;
		}
		
		if(!sess.login_users){
			sess.login_users = {}
		}
		if(!sess.login_users[username]){
			sess.login_users[username] = username;
		}
		if(!sess.living_number){
			sess.living_number = 1; 
		}else{
			sess.living_number+=1;
		}
		console.log('User '+username+' login.');
		console.log('Living number: '+sess.living_number);


//main too
	new Promise((resolve,reject)=>{
		if(!sess.info){
			sess.info = {};
		}
		if(sess.info[username]){
			resolve(sess.info[username]);
		}else{
			People.find({username},(err,detail)=>{
				if(!sess.info){
					sess.info={};
				}
				sess.info[username] = detail[0];
				var user_info = sess.info[username];
				resolve(user_info);
			});
		}
	}).then((result)=>{
		var user_info = result;
	Message.find({username},(err,detail)=>{
		var	m = detail[0].mess;
		var mess = {
			str:{},
			sta:{}
		};
	StarMark.find({username},(err,detail)=>{
		var stars = detail[0].stars;
		for(let i of stars){
			People.find({username:i},(err,detail)=>{
				var star_info = {
					username:detail[0].username,
					nickname:detail[0].nickname,
					introduce:detail[0].introduce,
					headImg:detail[0].headImg
				}
				mess['sta'][i]=star_info;
			})
		}
		
		//从尾部向头部遍历收到的消息
		for(let i=m.length-1;i>=0;i--){
			var user_from = m[i].from.username;
			var isStar=false;
			for(let i of stars){
				if(i===user_from){
					isStar=true;
					break;
				}
			}
			if(!isStar){
				if(!mess['str'][user_from]){
					mess['str'][user_from]=[];
				}
				if(mess['str'][user_from].length<3){
					mess['str'][user_from].unshift(m[i].body);
				}
			}
		}

	Peopleteam.find({username},(err,detail)=>{

		var build = detail[0].build,
			t = detail[0].join;

		var	tmess = [],
			j=0;

			t.unshift(build);
			t.forEach((id)=>{
				Team.find({id},(err,detail)=>{
					var d = detail[0];
					if(d){
						tmess.push({
						name:d.teamname,
						id:d.id,
						intro:d.introduce,
						avator:d.headImg
					})
					}
					j++;
				})
			})

			render();
			function render(){
				setTimeout(function(){
				if(j===t.length){
				var J_user_info = JSON.stringify(user_info),
					J_mess = JSON.stringify(mess),
					J_tmess = JSON.stringify(tmess);
				res.render('main.ejs',{
					user_info:J_user_info,
					username,
					mess:J_mess,
					tmess:J_tmess,
					star:stars,
				})
				}else{
					render();
				}
				},50)
			}
	})
	})
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