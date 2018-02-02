const {
	router,
	urlencodedParser,
	upload,
} = require('../../configs/server.config.js');
//used by public/js/main.js g78,
router.post('/myteam',urlencodedParser,(req,res)=>{
	var data = req.body;

	//set the variable to recored,
	var teamids = [],teaminfos = [];
	Loginlist.find(
		{
			uid:data.uid
		},
		null,
		{
			limit:1
		},
		function(err,loginlist){
			if(err) throw err;

			teamids = loginlist[0].team

			teamids.forEach((teamid)=>{
				Team.find(
					{
						uid:teamid
					},
					null,
					{
						limit:1
					},
					function(err,teaminfo){
						if(err) throw err;

						teaminfos.push(teaminfo[0]);

					}
				);
			});

			(function render(){
				if(teaminfos.length === teamids.length){
					res.render('myteam.ejs',{ 
	 					uid:data.uid,
	 					teaminfos:JSON.stringify(teaminfos)
	 				});
	 			}else{
		 			setTimeout(function(){
		 				render();
		 			},50);
	 			}
			})();
			
		}
	);
});


//used by public/js/myteam.js g73, 
//the page of teams to finish the information of the team,
//获取团队信息
router.get('/teams', (req,res)=>{
	var uid = req.query.uid;

	Team.find({uid},null,{limit:1},(err,team)=>{ 
		if(err) throw err;
		res.render('teams.ejs',team[0]);
	});
});


//used by public/js/teams.js g4,
//upload the portrait of the team,

//更新团队图片
router.post('/teamsImageUpdate',upload.any(),(req,res)=>{
	var uid = req.body.uid;
	var image = req.files[0];

	var readpath = 'img/uploads/'+image.filename;

	Team.update( { uid }, { $set:{ headImg:readpath }},(err) => {
		if(err) throw err;
		res.send(readpath);
	});
});


//used by public/js/teams.js g88,
//upload the content of the team,
//更新团队内容
router.post('/teamsTextUpdate',urlencodedParser,(req,res)=>{
	var data = req.body;
	Team.update({uid:data.uid},{$set:data},(err)=>{
		if(err) throw err;
		res.send(true);
	});
});


//used by public/js/main.js,
router.post('/DealWithTeam',urlencodedParser,(req,res)=>{
	var data = req.body;

	Loginlist.find(
		{
			uid:data.uid
		},
		null,
		{
			limit:1
		},
		function(err,loginlist){
			if(err) throw err;

			var teamIds = loginlist[0].team; 
			var j = false;

			for(var teamid of teamIds){
				if(teamid===data.uid){
					j = true;
					break;
				}
			}

			var ejs = j?'tipDealWithTeam.ejs':'buildteam.ejs';
			res.render( ejs, {
				uid:data.uid
			});
		})
})


//used by views/ubildTeam.ejs,
router.post('/successBuildTeam',urlencodedParser,(req,res)=>{
	var data = req.body;

	var uid = data.uid;
	var teamname = data.teamname;
	var password = data.password;


	var team = new Team({
		headImg:'/img/teamDefaultHead.jpg',
		uid : uid,
		name: teamname,
		password:password,
		level:1,
		member:[data.uid],
		introduce:'队长没有什么要说。'
	});
	
	var tmessage = new Tmessage({
		uid:uid,
		mess:[]
	});

	Loginlist.update(
		{
			uid: uid
		},
		{
			$push:{
				team: uid
			}
		},
		function(err){
			if(err) throw err;
		}
	);
	
	Unread.find(
		{
			uid:uid
		},
		null,
		{
			limit:1
		},
		function(err,unread){
			if(err) throw err;
			console.log(unread);
			var tunRead = unread[0]['tunRead'];

			tunRead[uid] = 0;
			Unread.update(
				{
					uid:data.uid
				},
				{
					$set:{
						tunRead
					}
				},
				function(err){
					if(err) throw err;
					res.render('successBuildTeam.ejs',{
					});
				}
			);

		}
	);

	team.save();
	tmessage.save();


});





//退出团队
router.post('/exitTeam',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	Team.update(
		{
			uid:data.tid
		},
		{
			$pull:{
				member:data.uid
			},
			$inc:{
				membernumber:-1
			}
		},
		function(err){
			if(err) throw err;
		}
	);
	Loginlist.update(
		{
			uid:data.uid
		},
		{
			$pull:{
				recent_team:data.tid,
				team:data.tid
			}
		},
		function(err){
			if(err) throw err;
		}
	);
	res.send(true);
})



//查看团队成员
router.get('/showMembers', (req,res) => {

	var tid = req.query.tid;
	
	Team.find({uid:tid},'member',{limit:1},(err,detail)=>{
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



//used by views/tipDealWithTeam.js,
//解散团队
router.get('/dismissTeam', (req,res)=>{
	var uid = req.query.uid;
	console.log(req.query);

	Team.find({uid},'password',{limit:1},(err,team)=>{
		if(err) throw err;

		res.render('dismissTeam.ejs',{
			team_password:team[0].password,
		});
	})
});

//used by views/dismissTeam.ejs,
router.post('/successDismissTeam',urlencodedParser,(req,res)=>{
	var data = req.body;
	console.log(data);

	Team.find({uid:data.ID},null,{limit:1},(err,detail)=>{
		var members = detail[0].member;
		members.forEach(userid=>{
			Loginlist.update({uid:userid},{$pull:{team:userid}},(err)=>{
				console.log(userid + ' quit whit the team '+data.ID);				
			});
		})
		Team.remove({uid:data.ID},(err)=>{
			console.log('success to delete the team in DB');
			res.render('successDismissTeam.ejs',{
				uid:data.ID
			});
		})
	})
})


module.exports = router;  