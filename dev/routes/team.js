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
const Unread = require('../mongoModel/unread');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');


const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();

//myteam
router.post('/myteam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	CHECK(data,'myteam')

	new Promise((resolve,reject)=>{
		Loginlist.find({uid:data.uid},(err,detail)=>{ 
			resolve(detail[0].team);
		})
	}).then((team)=>{
		CHECK(team,'myteam_promise.then')
		var teaminfo = [];
		team.forEach(a=>{
			Team.find({uid:a},(err,detail)=>{ teaminfo.push(detail[0]); })
		})
 		render();
 		function render(){
 			setTimeout(function(){
 				if(team.length === teaminfo.length){
 					res.render('afterL/myteam.ejs',{ uid:data.uid, teaminfo:JSON.stringify(teaminfo), })
 				}else{ render(); }
 			},50);
 		}
	});	
})



//teams finish Team's Information
router.post('/teams',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	Team.find({uid:data.uid},(err,detail)=>{
		if(!sess.teaminfo){	sess.teaminfo={}; }
		sess.teaminfo[data.uid] = detail[0];
		res.render('afterL/teams.ejs',sess.teaminfo[data.uid])
	})

})

//team headimg uploads
router.post('/teamsI',upload.any(),(req,res)=>{
	var sess = req.session;
	var data = req.body;
	var image = req.files[0];
	CHECK(data,'d_teamsI')
	fs.readFile(image.path,(err,DATA)=>{
		var headImgPath = '/img/uploads/'+image.filename+'.jpg';
		fs.writeFile('public'+headImgPath,DATA,(err)=>{
			Team.update({uid:data.uid},{$set:{headImg:headImgPath}},(err,a)=>{
				Team.find({uid:data.uid},(err,detail)=>{
					CHECK(detail[0],'TeamsIFind');
					res.render('afterL/teams.ejs',detail[0]);
				})
			});
		});	
	});
});

//team text uploads
router.post('/teamsT',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'teamsT')
	res.send(req.body.J_data);
	Team.update({uid:data.uid},{$set:data},(err)=>{})
})


router.post('/DealWithTeam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	CHECK(data,'DealWithTeam')
	Loginlist.find({uid:data.uid},(err,detail)=>{
		var teams = detail[0].team; 
	new Promise(resolve=>{
		var j;
		teams.forEach(a=>{
			if(a===data.uid){ j=true; }
		})
		resolve(j);
	}).then((j)=>{
		var ejs;
		(j)?ejs='tipDealWithTeam.ejs':ejs='buildTeam.ejs';
		res.render('afterL/'+ejs,{ uid:data.uid, })
	})
	})
})

router.post('/successB',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	CHECK(data,'successB')

	var team = new Team({
		headImg:'/img/defaultHead.jpg',
		uid:data.uid,
		name:data.name,
		password:data.password,
		level:1,
		member:[data.uid],
		membernumber:1,
		introduce:'This team does not have a introduce presently',
	});
	var tmessage = new Tmessage({ uid:data.uid, mess:[], });
	Loginlist.update({uid:data.uid},{$push:{team:data.uid}},(err)=>{})
	Message.find({uid:data.uid},(err,detail)=>{
		var tunr = detail[0]['tunReadNumber'];
		CHECK(tunr,'messagetunr')
		tunr[data.uid]=0;
		Message.update({uid:data.uid},{$set:{tunReadNumber:tunr}},(err)=>{});
	})
	team.save();
	tmessage.save();
	res.render('afterL/successB.ejs',{ uid:data.uid, })
})


//dismiss my initial team
router.post('/dismissTeam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	CHECK(data,'dismissTeam');

	Team.find({uid:data.uid},(err,detail)=>{
		CHECK(detail[0],'teamteam')
		res.render('afterL/dismissTeam.ejs',{
			uid:data.uid,
			pw:detail[0].password,
		})
	})
})


router.post('/success_dismissTeam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	console.log(data);

	Team.find({uid:data.ID},(err,detail)=>{
		var members = detail[0].member;
		Loginlist.update({uid:data.ID},{$pull:{build:data.ID}},err=>{
			members.forEach(a=>{
		Loginlist.find({uid:a},(err,detail)=>{
			var team = detail[0].team;
			for(let i=0;i<team.length;i++){
				if(team[i]===data.ID){
					team.splice(i,1);
				}
			}
			Loginlist.update({uid:a},{$set:{team}},err=>{});
		});
		});
		});
		Team.remove({uid:data.ID},(err)=>{
			res.render('afterL/success_dismissTeam.ejs',{ uid:data.ID })
		})
	})
})


module.exports = router;  