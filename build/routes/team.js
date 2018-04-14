const {
	router,
	urlencodedParser,
	upload,
	Team,
	List,
	sequence
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
	sequence(
		next=>{
			List.update({uid},{$pull:{team:tid}},(err)=>{
				next();
			});
		},
		next=>{
			Team.update({uid:tid},{$pull:{member:uid}},(err)=>{
				console.log('leave team successfully!');
				res.send(true);
			});
		}
	);
});


//查看团队成员
router.get('/showMembers', (req,res) => {

	var tid = req.query.tid;
	
	let data = {};
	sequence(
		next=>{
			Team.findOne({uid:tid},(err,t)=>{
				data.members = t.member;
				data.member_infos = [];
				next();
			});
		},
		next=>{
			data.members.forEach(member=>{
				People.findOne({uid:member},(err,p)=>{
					data.member_infos.push(p);
					if(member_infos.length===members.length) next();
				})
			})
		},
		next=>{
			res.send(JSON.stringify(data.member_infos));
		}
	)
})


router.get('/getTInfo',(req,res)=>{
	let uid = req.query.uid;
	console.log('-----------getTInfo-----------');
	Team.findOne({uid},(err,d)=>{
		console.log(d);
		res.send(d);
	});
});

module.exports = router;  