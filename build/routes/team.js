const {
	router,
	urlencodedParser,
	upload,
	Team,
	List,
} = require('../../configs/server.config.js');


router.post('/myteamUpdateImage',upload.any(),(req,res)=>{
	console.log('-------myteamUpdateImage-------');

	let uid = req.body.uid;
	let img = req.files[0];

	console.log('the image:');
	console.log(img);

	let headImg = 'uploads/'+img.filename;
	Team.update({ uid }, { $set:{ headImg }}, (err) => {
		console.log('Success to update team headImg')
		res.send(headImg);
	});
});


router.post('/myteamUpdateText',urlencodedParser,(req,res)=>{
	let data = req.body;
	console.log('------myteamUpdateText------');
	console.log('get Data:');
	console.log(data);
	Team.update({uid:data.uid},{$set:data},err=>{
		console.log('Success to update team text info');
		res.send(true);
	});
});


router.post('/leaveTeam',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	let tid = req.body.tid;
	console.log('req.body:');
	console.log(req.body);

	console.log('uid,tid...');
	console.log(uid,tid);

	List.update({uid},{$pull:{team:tid}},(err)=>{
		console.log('leave team successfully!');
		res.send(true);
	});
});


//查看团队成员
router.get('/showMembers', (req,res) => {

	var tid = req.query.tid;
	
	Team.findOne({uid:tid},(err,t)=>{
		var members = t.member;
		var member_infos = [];
		members.forEach(member=>{
			People.findOne({uid:member},(err,p)=>{
				member_infos.push(p);
				if(member_infos.length===members.length){
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

	Team.findOne({uid},(err,t)=>{
		res.render('dismissTeam.ejs',{
			team_password:team[0].password,
		});
	})
});

//used by views/dismissTeam.ejs,
router.post('/successDismissTeam',urlencodedParser,(req,res)=>{
	var data = req.body;
	console.log(data);

	Team.findOne({uid:data.ID},(err,d)=>{
		var members = d.member;
		members.forEach(userid=>{
			List.update({uid:userid},{$pull:{team:data.ID}}).exec();
		})
		Team.remove({uid:data.ID},(err)=>{
			res.render('successDismissTeam.ejs',{
				uid:data.ID
			});
		})
	})
})


module.exports = router;  