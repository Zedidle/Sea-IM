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
		Team.update({uid:tid},{$pull:{member:uid}},(err)=>{
			console.log('leave team successfully!');
			res.send(true);
		});
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


module.exports = router;  