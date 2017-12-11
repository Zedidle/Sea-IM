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

//used by public/js/main.js g78,
router.post('/myteam',urlencodedParser,(req,res)=>{
	var data = req.body;
	LIB.userFakeLogout(User,data.uid);
	// LIB.check(data,'myteam');

	//set the variable to recored,
	var teamids = [],teaminfo = [];
	Loginlist.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		teamids = detail[0].team
		LIB.check(teamids,'my joined teams:')
		teamids.forEach((teamid)=>{
			Team.find({uid:teamid},null,{limit:1},(err,detail)=>{ teaminfo.push(detail[0]); }) 
		});
	});
	//use the recursion to LIB.check whether teaminfo satisfy the conditions to render the page,
 	(function render(){
 		setTimeout(function(){
 			if(teaminfo.length === teamids.length){
 				res.render('myteam.ejs',{ uid:data.uid, teaminfo:JSON.stringify(teaminfo), })
 			}else{ render(); }
 		},50);
 	})();
})


//used by public/js/myteam.js g73, 
//the page of teams to finish the information of the team, 
router.post('/teams',urlencodedParser,(req,res)=>{
	var data = req.body;
	Team.find({uid:data.uid},null,{limit:1},(err,detail)=>{ 
		res.render('teams.ejs',detail[0]);
	});
})

//used by public/js/teams.js g4,
//upload the portrait of the team,
router.post('/teamsI',upload.any(),(req,res)=>{
	var data = req.body;
	var image = req.files[0];
	var datapath = image.path;
	var savepath = 'dist/'+image.destination+image.filename;
	var readpath = 'img/uploads/'+image.filename;
	fs.readFile(datapath,(err,image_data)=>{
		fs.writeFile(savepath,image_data,(err)=>{
			Team.update({uid:data.uid},{$set:{headImg:readpath}},err=>{
				Team.find({uid:data.uid},null,{limit:1},(err,detail)=>{
					res.render('teams.ejs',detail[0]);
				})
			});
		})
	})
});


//used by public/js/teams.js g88,
//upload the content of the team,
router.post('/teamsT',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.check(data,'content of the team:');
	res.send(req.body.J_data);
	Team.update({uid:data.uid},{$set:data},(err)=>{})
})


//used by public/js/main.js g79,
router.post('/DealWithTeam',urlencodedParser,(req,res)=>{
	var data = req.body;
	// LIB.check(data,'deal with team:');
	//get the teams the user has joined in,
	Loginlist.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var teamIds = detail[0].team; 
		var j = false;
		//judge if the team is set up by the user,
		for(var teamid of teamIds){
			if(teamid===data.uid){ j = true; break; }
		}
		var page_ejs = j?'tipDealWithTeam.ejs':'buildteam.ejs';
		res.render(''+page_ejs,{ uid:data.uid });
	})
})


//used by views/ubildTeam.ejs g38,
router.post('/successB',urlencodedParser,(req,res)=>{
	var data = req.body;

	// LIB.check(data,'success to build a team:')

	var team = new Team({
		headImg:'/img/defaultHead.jpg',
		uid:data.uid,
		name:data.teamname,
		password:data.password,
		level:1,
		member:[data.uid],
		membernumber:1,
		introduce:'This team does not have a introduce presently',
	});
	var tmessage = new Tmessage({ uid:data.uid, mess:[], });
	Loginlist.update({uid:data.uid},{$push:{team:data.uid}},(err)=>{})
	Unread.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var tunRead = detail[0]['tunRead'];
		LIB.check(tunRead,'tunRead of the user: ');
		tunRead[data.uid]=0;
		Unread.update({uid:data.uid},{$set:{tunRead}},(err)=>{});
	})
	team.save();
	tmessage.save();
	res.render('successB.ejs',{ uid:data.uid, })
})


//used by views/tipDealWithTeam.js g55,
//dismiss my own team
router.post('/dismissTeam',urlencodedParser,(req,res)=>{
	var data = req.body;
	Team.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		res.render('dismissTeam.ejs',{
			uid:data.uid,
			pw:detail[0].password,
		})
	})
})



router.post('/exitTeam',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	Team.update({uid:data.tid},{
		$pull:{member:data.uid}
		,$inc:{membernumber:-1}
	},err=>{});
	Loginlist.update({uid:data.uid},{$pull:{recent_team:data.tid,team:data.tid}},err=>{});
	res.send(true);
})


router.post('/showMembers',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	Team.find({uid:data.tid},'member',{limit:1},(err,detail)=>{
		var members = detail[0].member;
		var member_infos = [];
		members.forEach(member=>{
			People.find({uid:member},null,{limit:1},(err,detail)=>{
				member_infos.push(detail[0]);
				if(member_infos.length===members.length){
					console.log(member_infos);
					res.send(JSON.stringify(member_infos));
				}
			})
		})
	})
})







//used by views/dismissTeam.ejs g51,
router.post('/success_dismissTeam',urlencodedParser,(req,res)=>{
	var data = req.body;
	console.log(data);

	Team.find({uid:data.ID},null,{limit:1},(err,detail)=>{
		var members = detail[0].member;
		members.forEach(userid=>{
			Loginlist.update({uid:userid},{$pull:{team:userid}},err=>{
				console.log(userid + ' quit whit the team '+data.ID);				
			});
		})
		Team.remove({uid:data.ID},(err)=>{
			console.log('success to delete the team in DB');
			res.render('success_dismissTeam.ejs',{ uid:data.ID })
		})
	})
})


module.exports = router;  