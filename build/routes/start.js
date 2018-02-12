const {
	z,
	User,
	router,
	urlencodedParser,
	crypto,
	Unread,
	People,
	Team,
	Pmess,
	List,
} = require('../../configs/server.config.js');


//---------------------Part of Regist----------------------


// This router just for "Checking an UID whether exist"
router.get('/checkUidIsUsed', urlencodedParser, (req,res)=>{
	let uidEnsure = req.query;
	User.findOne(uidEnsure,(err,u) =>{ res.send(Boolean(u));});
});


// toRegist
router.post('/regist', urlencodedParser, (req,res)=>{

	let uid = req.body.uid;
	let password = req.body.password;

	z.L(uid,password);

	let hash = crypto.createHash('sha1');
	hash.update(password);

	new Unread({ uid }).save();
	new People({ uid }).save();
	new List({ uid }).save();
	new Pmess({ uid }).save();
	new User({ uid, password:hash.digest('hex') })
		.save((err)=>{
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
		.exec((err,u)=>{ res.send(!(u&&u.login)); })
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
			

			// 获取用户信息和未读消息状况
			People.findOne({uid},(err,user_info)=>{
				Unread.findOne({uid},(err,unread)=>{ resolve({ user_info, unread, }); })
			});

		}).then((info)=>{
			let 
				user_info = info.user_info,
				punr = info.unread.punr,
				tunr = info.unread.tunr;

			/*获取联系列表*/
			List.findOne({uid},(err,d)=>{

				
			z.check(d,'list');

				let 
					J_list = JSON.stringify(d),
					//以下的star和team是要让vuex记录备份的
					rp = d.recent_people,
					rt = d.recent_team,
					s = d.star,
					t = d.team;

				Promise.all([

					/*获取rencent的状况,并把个人和团队的整合*/
					new Promise(function(resolve,rejected){
						if(rp.length || rt.length){
							let recentInfo = [];
							let total_length = rp.length + rt.length;
							rp.forEach(pid=>{
								People.findOne({uid:pid},(err,pInfo)=>{
									recentInfo.push(pInfo);
									
									/*当处理完个人消息,再处理团队消息*/
									if(recentInfo.length===rp.length){
										if(recentInfo.length === total_length){
											resolve(recentInfo);
										}else{
											rt.forEach(tid=>{
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
					})

					/*获取星标的状况*/
					,new Promise(function(resolve,rejected){
						if(s.length){
							let	starInfo = [];
							s.forEach(sid=>{
								People.findOne({uid:sid},(err,d)=>{
									starInfo.push(d);
									if(s.length===starInfo.length){ resolve(starInfo); }
								})
							})
						}else{ resolve([]); }
					})

					/*获取团队的状况*/
					,new Promise(function(resolve,rejected){
						if(t.length){
							let	teamInfo = [];
							t.forEach(tid=>{
								Team.findOne({uid:tid},(err,d)=>{
									teamInfo.push(d);
									if(t.length===teamInfo.length){ resolve(teamInfo); }
								})
							})
						}else{ resolve([]) }
					})
				]).then(infos=>{

					/*返回数据*/
					res.send({
						uid,
						punr:JSON.stringify(punr),
						tunr:JSON.stringify(tunr),
						user_info:JSON.stringify(user_info),
						list:J_list,
						recentInfo:JSON.stringify(infos[0]),
						starInfo:JSON.stringify(infos[1]),
						teamInfo:JSON.stringify(infos[2]),
					});

					//login: true
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
