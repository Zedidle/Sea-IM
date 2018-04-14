const {
	// z,
	User,
	router,
	urlencodedParser,
	crypto,
	Unread,
	People,
	Pmess,
	Team,
	Tmess,
	List,
	sequence,
} = require('../../configs/server.config.js');


//---------------------Part of Regist----------------------


// This router just for "Checking an UID whether exist"
router.get('/checkUidIsUsed',(req,res)=>{
	let uidEnsure = req.query;
	User.findOne(uidEnsure,(err,u) =>{ res.send(Boolean(u));});
});


// toRegist
router.post('/regist', urlencodedParser, (req,res)=>{

	let uid = req.body.uid;
	let password = req.body.password;

	console.log('uid,password:');
	console.log(uid,password);

	let hash = crypto.createHash('sha1');
	hash.update(password);

	new Unread({ uid }).save();
	new People({ uid }).save();
	new List({ uid,team:[uid] }).save();
	new Pmess({ uid }).save();
	new Team({ 
		uid,
		name: 'TEAM '+uid,
		member:[uid],
		password:uid
	}).save();
	new Tmess({ uid }).save();
	new User({ 
		uid,
		password:hash.digest('hex')
	}).save((err)=>{
		res.send(!Boolean(err));
	});

});












//--------------------------Part of Login-------------------------

//登录有两步:


//1.判断帐号是否存在，是否处于登录状态
router.get('/loginJudge', (req,res) => {
	let uid = req.query.uid;
	let password = req.query.password;

	let hash = crypto.createHash('sha1');
	hash.update(password)

	User.findOne({ uid, password:hash.digest('hex')},(err,u)=>{ 
		if(u){
			res.send(u.login?'l':true);
		}else{
			res.send(false);
		}
	});
});


//2.获取所有与该用户相关连的信息
router.post('/login', urlencodedParser,(req,res)=>{
	let 
		hash = crypto.createHash('sha1'),
		uid = req.body.uid,
		password = req.body.password;

	hash.update(password);

	let data = {};
	sequence(
		next=>{
			User.findOne({uid,password:hash.digest('hex')},(err,u)=>{
				if(u&&u.login){ 
					res.send(false); return;
				}
				next();
			})
		},
		next=>{
			People.findOne({uid},(err,user_info)=>{
				data.user_info = user_info;
				next();
			})
		},
		next=>{
			Unread.findOne({uid},(err,unread)=>{ 
				data.unread = unread;
				next();
			});
		},
		next=>{
			let user_info = data.user_info,
				punr = data.unread.punr,
				tunr = data.unread.tunr;
			
			List.findOne({uid},(err,d)=>{
				data.J_list = JSON.stringify(d);
				data.rp = d.recent_people;
				data.rt = d.recent_team;
				data.s = d.star;
				data.t = d.team;
				next();
			});
		},
		next=>{
			let recentInfo = [];
			let total_length = data.rp.length + data.rt.length;
			
			data.rp.forEach(pid=>{
				People.findOne({uid:pid},(err,pInfo)=>{
					recentInfo.push(pInfo);
					
					if(recentInfo.length===data.rp.length){
						if(recentInfo.length === total_length){
							data.recentInfo = recentInfo;
							next();
						}else{
							data.rt.forEach(tid=>{
								Team.findOne({uid:tid},(err,tInfo)=>{
									recentInfo.unshift(tInfo);
									if(recentInfo.length === total_length){
										data.recentInfo = recentInfo;
										next();
									}
								});
							});
						}
					}
				});
			});
		},
		next=>{
			if(data.s.length){
				let	starInfo = [];
				s.forEach(sid=>{
					People.findOne({uid:sid},(err,d)=>{
						starInfo.push(d);
						if(s.length===starInfo.length){ 
							data.starInfo = starInfo;
							next(); 
						}
					})
				})
			}
		},
		next=>{
			if(data.t.length){
				let	teamInfo = [];
				t.forEach(tid=>{
					Team.findOne({uid:tid},(err,d)=>{
						teamInfo.push(d);
						if(t.length===teamInfo.length){
							data.teamInfo = teamInfo;
							next();
						}
					})
				})
			}
		},
		next=>{
			res.send({
				uid,
				punr:JSON.stringify(data.unread.punr),
				tunr:JSON.stringify(data.unread.tunr),
				user_info:JSON.stringify(data.user_info),
				list:data.J_list,
				recentInfo:JSON.stringify(data.recentInfo),
				starInfo:JSON.stringify(data.starInfo),
				teamInfo:JSON.stringify(data.teamInfo),
			});

			//login: true
			User.update({uid},{$set:{login:true}},(err)=>{
				console.log(uid+' login');
			});
		}
	)
});





router.post('/logOff',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	User.update({uid},{$set:{login:false}},(err)=>{ 
		console.log(uid+" logoff ↓");
	});
});


module.exports = router;