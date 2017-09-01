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
const Peopleteam = require('../mongoModel/peopleteam');
const StarMark = require('../mongoModel/starMark');

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router();

//myteam
router.post('/myteam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	if(!sess.teaminfo){
		sess.teaminfo = {};
	}

	new Promise((resolve,reject)=>{
		Peopleteam.find({username:data.username},(err,detail)=>{

			CHECK(sess.teaminfo[data.username])
			resolve(detail[0]);
		})
	}).then((a)=>{
		var b = a.build,
			j = a.join;
		
		Team.find({id:b},(err,detail)=>{
		var buildteam = detail[0],
			jointeam = [];

		sess.teaminfo[data.username] = buildteam;
 		
 		j.forEach((e)=>{
			Team.find({id:e},(err,detail)=>{
				jointeam.push(detail[0])
			})
		})
 			
 		render();
 		function render(){
 		setTimeout(function(){
 		if(jointeam.length === j.length){
 			var	buildtip,jointip;
 			(buildteam)?buildtip='':buildtip='NOT RECORD';
 			(jointeam.length)?jointip='':jointip='NOT RECORD';
 			buildteam = JSON.stringify(buildteam);
 			jointeam = JSON.stringify(jointeam);
 			res.render('afterL/myteam.ejs',{
 				username:data.username,
				buildteam,
				jointeam,
				buildtip,
				jointip,
			})
 		}else{
 			render();
 		}},50);
 		}	
		});	
	})

})


//teams finish Team's Information
router.post('/teams',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	var teaminfo = sess.teaminfo[data.username];
	res.render('afterL/teams.ejs',{
		headImg:teaminfo.headImg,
		id:teaminfo.id,
		teamname:teaminfo.teamname,
		level:teaminfo.level,
		membernumber:teaminfo.membernumber,
		major:teaminfo.major,
		introduce:teaminfo.introduce ,
	})

})

//team headimg uploads
router.post('/teamsI',upload.any(),(req,res)=>{
	var sess = req.session;
	var data = req.body;
	var image = req.files[0];

	fs.readFile(image.path,(err,DATA)=>{
		var headImgPath = '/img/uploads/'+image.filename+'.jpg';
		fs.writeFile('public'+headImgPath,DATA,(err)=>{
	Team.update({id:data.id},{$set:{headImg:headImgPath}},(err)=>{
		sess.teaminfo[data.id].headImg = headImgPath;
		var teaminfo = sess.teaminfo[data.id];
		res.render('afterL/teams.ejs',{
			headImg:teaminfo.headImg,
			id:teaminfo.id,
			teamname:teaminfo.teamname,
			level:teaminfo.level,
			membernumber:teaminfo.membernumber,
			major:teaminfo.major,
			introduce:teaminfo.introduce ,			
		});
	});
		});	
	});

});

//team text uploads
router.post('/teamsT',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);

	res.send(req.body.J_data);
	
	for(var para in data){
		sess.teaminfo[data.id][para] = data[para];
	}
	Team.update({id:data.id},{$set:data},(err)=>{
		if(err) throw err;
	})
})


router.post('/buildTeam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	Peopleteam.find({username:data.username},(err,detail)=>{
		var b = detail[0].build;
		var ejs;
		(b)?ejs='tipBuildTeam.ejs':ejs='buildTeam.ejs';
		res.render('afterL/'+ejs,{
			username:data.username,
		})
	})
})


router.post('/successB',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;

	var team = new Team({
		headImg:'/img/defaultHead.jpg',
		id:data.username,
		teamname:data.teamname,
		password:data.password,
		level:1,
		member:[data.username],
		membernumber:1,
		major:data.major,
		introduce:'This team does not have a introduce presently',
	});
	var tmessage = new Tmessage({
		id:data.username,
    	mess:[],
	})
	Peopleteam.update({username:data.username},{$set:{build:data.username}},(err)=>{
		team.save((err)=>{
		tmessage.save();
		res.render('afterL/successB.ejs',{
			username:data.username,
		})
		})
	})
})


//dismiss my initial team
router.post('/dismiss',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	CHECK(data);

	Team.find({id:data.username},(err,detail)=>{
		res.render('afterL/dismissTeam.ejs',{
			id:detail[0].id,
			pw:detail[0].password,
		})
	})
})


router.post('/dismissTeam',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	console.log(data);

	Team.find({id:data.ID},(err,detail)=>{
		var members = detail[0].member;
		Peopleteam.update({username:data.ID},{$set:{build:''}},err=>{
			members.forEach(a=>{
		Peopleteam.find({username:a},(err,detail)=>{
			var joins = detail[0].join;
			for(let i=0;i<joins.length;i++){
				if(join[i]===data.ID){
					join.splice(i,1);
		Peopleteam.update({username:a},{$set:{join:joins}},err=>{
			if(err) throw err;
		});
				}
			}
		});
			});
		});
		Team.remove({id:data.ID},(err)=>{
			res.render('afterL/successR.ejs',{
				username:data.ID
			})
		})
	})
})


module.exports = router;  