const {
	router,
	urlencodedParser,
	List,
	People,
	Team,
	Unread,
} = require('../../configs/server.config.js');


router.get('/searchTeam', (req,res) => {
	let keyword = req.query.keyword;
	let reg = new RegExp(keyword, 'i'); //不区分大小写

	Team.find({
		$or : [ //多条件，数组
			{uid : {$regex : reg}},
			{name : {$regex : reg}}
		] 
	},(err,t) => {
		res.send(t);
	});
});


router.get('/searchPeople', (req,res) => {
	let keyword = req.query.keyword;
	let reg = new RegExp(keyword, 'i'); //不区分大小写

	console.log('------------searchPeople----------');
	console.log('keyword:');
	console.log(keyword);
	console.log('reg:');
	console.log(reg);

	People.find({
		$or : [
			{uid : {$regex : reg}},
			{name : {$regex : reg}}
		]
	},(err,p) => {
		console.log('The result of the search:');
		console.log(p);
		res.send(p);
	});

});


//used by public/js/main-content.js,
//if a person choice to join a team, must pass this part,
router.get('/joinJudge', (req,res)=>{
	let uid = req.query.uid;
	let tid = req.query.uid;

	List.findOne({ uid },(err,l) => {
		if(err) throw err;
		let judge='ok';

		if(l.team.length<4){
			for(let teamid of l.team){
				if(teamid === tid){
					judge = '你已经加入了这个团队!'; 
					break; 
				}
			}
		}else{
			judge = '最多可以加入４个团队!';
		}

		res.send(judge);
	});
});


//used by public/js/main.js g177,
router.post('/join',urlencodedParser,(req,res)=>{
	let data = req.body;
	res.render('join.ejs',{
		uid:data.uid,
		tid:data.tid
	});
});


// used by views/join.ejs g68, 
router.post('/join_ok',urlencodedParser,(req,res)=>{
	let data = JSON.parse(req.body.J_data);
	Team.findOne({uid:data.tid},(err,d)=>{
		if(d.password===data.password){
			Team.update({uid:data.tid},{$inc:{membernumber:1},$push:{member:data.uid}},(err)=>{
				Pmess.findOne({uid:data.uid},(err,d)=>{
					let tunRead = d['tunRead'];
					tunRead[data.tid] = 0;
					Pmess.update({uid:data.uid},{$set:{tunRead}}).exec();
				});
				List.update({uid:data.uid},{$push:{team:data.tid}}).exec();
				res.send(true); 
			});
		}else{
			res.send(false);
		}
	});
});

//used by public/js/main.js g173,
router.post('/star',urlencodedParser,(req,res)=>{
	let data = JSON.parse(req.body.J_data);
	//update the List of the user,
	List.update({uid:data.uid},{$addToSet:{star:data.sid}}).exec();
	//update the unread of the user in recent,
	Unread.findOne({uid:data.uid},null,(err,d)=>{
		let punRead = d.punRead;
		//judge if punRead has id of the star for recent list,
		if(!punRead[data.sid]){ 
			punRead[data.sid] = 0;
			Unread.update({uid:data.uid},{$set:{punRead}}).exec();
		};
	});
	//get the information of the star,and send to the page,
	People.findOne({uid:data.sid},(err,d)=>{ res.send(JSON.stringify(d)); });
});


module.exports = router;