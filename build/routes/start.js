const {
	z,
	User,
	router,
	urlencodedParser,
	crypto,
	Unread,
	People,
	Loginlist,
	Message,
} = require('../../configs/server.config.js');





//---------------------Part of Regist----------------------


// This router just for "Checking an UID whether exist"
router.get('/checkUidIsUsed', urlencodedParser, (req,res)=>{
	let uidEnsure = req.query;
	User.findOne(uidEnsure, null,(err,u) =>{
		res.send(Boolean(u));
	});
});


// toRegist
router.post('/regist', urlencodedParser, (req,res)=>{

	let uid = req.body.uid;
	let password = req.body.password;

	z.L(uid,password);

	let hash = crypto.createHash('sha1');
	hash.update(password);


	let
		user = new User({ uid, password:hash.digest('hex') }),
		unread = new Unread({ uid }), 
		people = new People({ uid }),
		loginlist = new Loginlist({ uid }),
		message = new Message({ uid })

	unread.save();
	people.save();
	loginlist.save();
	message.save();
	user.save((err)=>{
		if(err){
			res.send(false);
			z.L(err)
		}else{
			//注册成功
			res.send(true);
		}

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

	User.findOne({ uid, password:hash.digest('hex')})
		.exec((err,u)=>{
			if(err) throw err;
			if(u.login){
				res.send(false);
			}else{
				res.send(Boolean(u));
			}
		})
});


//2.获取所有与该用户相关连的信息
router.post('/login', urlencodedParser,(req,res)=>{
	let 
		hash = crypto.createHash('sha1'),
		uid = req.body.uid,
		password = req.body.password;

	hash.update(password);


	User.findOne({uid},(err,u)=>{
		if(err) throw err;
		//如果用户存在且处于登录状态
		if(u&&u.login){ res.send(false); return; }

		new Promise((resolve,reject)=>{
			
			People.findOne({uid},(err,user_info)=>{
				Unread.findOne({uid},null,(err,unread)=>{
					resolve({ user_info, unread, });
				})
			});
		}).then((loginInfo)=>{
			let 
				user_info = loginInfo.user_info,
				punRead = loginInfo.unread.punRead,
				tunRead = loginInfo.unread.tunRead;

			Loginlist.findOne({uid},(err,d)=>{
				let 
					J_loginlist = JSON.stringify(d),
					recent_people = d.recent_people,
					recent_team = d.recent_team,
					star = d.star,
					team = d.team;

				Promise.all([
					new Promise(function(resolve,rejected){
						if(recent_people.length || recent_team.length){
							let recentInfo = [];
							let total_length = recent_people.length + recent_team.length;
							recent_people.forEach(pid=>{
								People.findOne({uid:pid},(err,pInfo)=>{
									recentInfo.push(pInfo);
									if(recentInfo.length===recent_people.length){
										if(recentInfo.length === total_length){
											resolve(recentInfo);
										}else{
											recent_team.forEach(tid=>{
												Team.findOne({uid:tid},(err,tInfo)=>{
													recentInfo.unshift(tInfo);
													if(recentInfo.length === total_length){
														resolve(recentInfo);
													}
												});
											});
										}
									}
								});
							});
						}else{ resolve([]) };
					}),
					new Promise(function(resolve,rejected){
						if(star.length){
							let	starInfo = [];
							star.forEach(sid=>{
								People.findOne({uid:sid},(err,d)=>{
									starInfo.push(d);
									if(star.length===starInfo.length){ resolve(starInfo); }
								})
							})
						}else{ resolve([]); }
					}),
					new Promise(function(resolve,rejected){
						if(team.length){
							let	teamInfo = [];
							team.forEach(tid=>{
								Team.findOne({uid:tid},(err,d)=>{
									teamInfo.push(d);
									if(team.length===teamInfo.length){ resolve(teamInfo); }
								})
							})
						}else{ resolve([]) }
					})
				]).then(info=>{

					// res.send()

					res.render('main.ejs',{
						punRead:JSON.stringify(punRead),
						tunRead:JSON.stringify(tunRead),
						user_info:JSON.stringify(user_info),
						loginlist:J_loginlist,
						recentInfo:JSON.stringify(info[0]),
						starInfo:JSON.stringify(info[1]),
						teamInfo:JSON.stringify(info[2]),
					});


					//make login status of user true;
					User.update({uid},{$set:{login:true}},(err)=>{
						console.log('(user)'+uid+' login');
						setTimeout(function(){
							User.update({uid},{$set:{login:false}},(err)=>{
								console.log(uid + ' stop');
							});
						},9000);
					});
				});
			});
		});
	})
});





router.post('/logOff',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	User.update({uid},{$set:{login:false}},(err)=>{ 
		console.log('(user)'+uid+" logoff ↓");
	});
	res.render('login.ejs',{ 
		loginTip:''
	});
});





// router.post('/exit',urlencodedParser,(req,res)=>{
// 	let data = JSON.parse(req.body.J_data);
// 	User.update({uid:data.uid},{$set:{login:false}},(err)=>{
// 		console.log('(user)'+data.uid+" exit ↓↓");
// 		res.send(req.body.J_data);
// 	})
// });

// router.post('/relogin',urlencodedParser,(req,res)=>{
// 	let data = JSON.parse(req.body.J_data);
// 	User.update({uid:data.uid},{$set:{login:true}},(err)=>{
// 		console.log('(user)'+data.uid+" relogin ↑↑");
// 		res.send(req.body.J_data);
// 	})
// });

module.exports = router;
