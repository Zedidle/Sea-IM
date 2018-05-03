const {
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

	redis,

} = require('../../configs/server.config.js');


//---------------------Part of Regist----------------------


// This router just for "Checking an UID whether exist"
router.get('/blurUid',(req,res)=>{
	User.findOne(req.query,(err,u) =>{ res.send(Boolean(u));});
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

	console.log(uid,password)

	User.findOne({ uid, password:hash.digest('hex')},(err,u)=>{ 
		res.send(u?(u.login?'l':true):false);
	});
});


//2.获取所有与该用户相关连的信息
router.post('/login', urlencodedParser,(req,res)=>{
	let 
		hash = crypto.createHash('sha1'),
		uid = req.body.uid,
		password = req.body.password;

	hash.update(password);

	console.log(uid,password)

	let resp = {};
	sequence(
		next=>{
		// console.log(1);
		// console.log(resp);		
			User.findOne({uid,password:hash.digest('hex')},(err,u)=>{
				if(u&&u.login){
					res.send(false); return;
				}
				next();
			})
		},
		next=>{
		// console.log(2);
		// console.log(resp);
			People.findOne({uid},(err,user_info)=>{
				resp.user_info = user_info;
				next();
			})
		},
		next=>{
		// console.log(3);
		// console.log(resp);
			Unread.findOne({uid},(err,unread)=>{ 
				resp.unread = unread;
				next();
			});
		},
		next=>{
		// console.log(4);
		// console.log(resp);
			let user_info = resp.user_info,
				punr = resp.unread.punr,
				tunr = resp.unread.tunr;
			
			List.findOne({uid},(err,d)=>{
				resp.J_list = JSON.stringify(d);
				resp.rp = d.recent_people;
				resp.rt = d.recent_team;
				resp.s = d.star;
				resp.t = d.team;
				next();
			});
		},
		next=>{
		// console.log(5.1);
		// console.log(resp);
			resp.recentInfo = [];
			if(resp.rp.length){
				resp.rp.forEach(pid=>{
					People.findOne({uid:pid},(err,pInfo)=>{
						resp.recentInfo.push(pInfo);
						if(resp.recentInfo.length === resp.rp.length) next();
					});
				});
			}else{
				next();
			}

		},
		next=>{
		// console.log(5.2);
		// console.log(resp);
			if(resp.rt.length){
				let total_length = resp.rp.length + resp.rt.length;
				resp.rt.forEach(tid=>{
					Team.findOne({uid:tid},(err,tInfo)=>{
						resp.recentInfo.unshift(tInfo);
						if(resp.recentInfo.length === total_length) next();
					});
				});
			}else{
				next();
			}

		},
		next=>{
		// console.log(6);
		// console.log(resp);
			resp.starInfo = [];
			if(resp.s.length){
				resp.s.forEach(sid=>{
					People.findOne({uid:sid},(err,d)=>{
						resp.starInfo.push(d);
						if(resp.starInfo.length === resp.s.length) next(); 
					})
				})
			}else{
				next(); 
			}
		},
		next=>{
		// console.log(7);
		// console.log(resp);
			if(resp.t.length){
				resp.teamInfo = [];
				resp.t.forEach(tid=>{
					Team.findOne({uid:tid},(err,d)=>{
						resp.teamInfo.push(d);
						if(resp.teamInfo.length === resp.t.length) next();
					})
				})
			}
		},
		next=>{
		// console.log(8);
		// console.log(resp);
			res.send({
				uid,
				punr:JSON.stringify(resp.unread.punr),
				tunr:JSON.stringify(resp.unread.tunr),
				user_info:JSON.stringify(resp.user_info),
				list:resp.J_list,
				recentInfo:JSON.stringify(resp.recentInfo),
				starInfo:JSON.stringify(resp.starInfo),
				teamInfo:JSON.stringify(resp.teamInfo),
			});

	      redis.set(uid,true,()=>{
	        setTimeout(()=>{
	          redis.set(uid,false,()=>{
	            console.log(uid,'bit')
	          });
	        },4950)
	      })
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