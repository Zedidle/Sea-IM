const {
	router,
	urlencodedParser,
	
} = require('../../configs/server.config.js');


//used by public/js/main-content.js,
router.get('/search', (req,res) => {
	var uid = req.query.uid;
	var result = {};

	//获取该ID的团队和人物信息
	Team.find({uid},null,{limit:1},(err,team) => {
		if(err) throw err;
		result.team = team.length?team[0]:'';

		People.findOne({ uid }, null, (err,p) => {
			if(err) throw err;
			result.person = p;
			res.send(result);
		});
	});
});

//used by public/js/main-content.js,
//if a person choice to join a team, must pass this part,
router.get('/joinJudge', (req,res)=>{
	var uid = req.query.uid;
	var tid = req.query.uid;

	Loginlist.findOne({ uid }, null, (err,loginlist) => {
		if(err) throw err;
		var judge='ok';

		if(loginlist.team.length<4){
			for(var teamid of loginlist.team){
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
	var data = req.body;
	res.render('join.ejs',{
		uid:data.uid,
		tid:data.tid
	});
});


// used by views/join.ejs g68, 
router.post('/join_ok',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	Team.findOne({uid:data.tid},null,(err,d)=>{
		if(d.password===data.password){
			Team.update({uid:data.tid},{$inc:{membernumber:1},$push:{member:data.uid}},(err)=>{
				Message.findOne({uid:data.uid},null,(err,d)=>{
					var tunRead = d['tunRead'];
					tunRead[data.tid] = 0;
					Message.update({uid:data.uid},{$set:{tunRead}},(err)=>{});
				});
				Loginlist.update({uid:data.uid},{$push:{team:data.tid}},(err)=>{});
				res.send(true); 
			});
		}else{
			res.send(false);
		}
	});
});

//used by public/js/main.js g173,
router.post('/star',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	//update the loginlist of the user,
	Loginlist.update({uid:data.uid},{$addToSet:{star:data.sid}},(err)=>{});
	//update the unread of the user in recent,
	Unread.findOne({uid:data.uid},null,(err,d)=>{
		var punRead = d.punRead;
		//judge if punRead has id of the star for recent list,
		if(!punRead[data.sid]){ 
			punRead[data.sid] = 0;
			Unread.update({uid:data.uid},{$set:{punRead}},err=>{});
		};
	});
	//get the information of the star,and send to the page,
	People.findOne({uid:data.sid})
		.exec((err,d)=>{
			res.send(JSON.stringify(d));
		});
});


module.exports = router;