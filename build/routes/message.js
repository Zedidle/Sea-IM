const {
	router,
	urlencodedParser,
	Tmess,
	Pmess,
	List,
} = require('../../configs/server.config.js');

router.post('/getMoreMessage', urlencodedParser, (req,res)=>{
	var data = req.body;
	console.log(data);

	var receiveUid = data.receiveUid;
	var fromUid = data.fromUid;

	new Promise((resolve,reject)=>{
		if(data.type!=='team'){
			Pmess.findOne({uid:receiveUid}, 'mess', (err,m) => {
				if(err) throw err;
				if(m){
					console.log()
					resolve(m.mess[fromUid]);
				}else{
					resolve(false);
				}
			});
		}else{
			Tmess.findOne({uid:fromUid}, 'mess', (err,tm) => {
				if(err) throw err;
				if(tm){
					resolve(tm.mess);
				}else{
					resolve(false);
				}
			});
		}
	}).then((messages) => {
		console.log(messages);
		res.send(messages);
	});
});

//used by main-methods.js
router.get('/getInfo', (req,res) => {

	var type = req.query.type;
	var uid = req.query.uid;

	console.log(type, uid);

	//如果是团队则会导致系统崩溃,为什么？

	if(type==='team'){
		Team.findOne({uid},(err,t)=>{ res.send(t); });
	}else{
		People.findOne({uid},(err,p)=>{ res.send(p);});
	}
});


router.post('/starOrUnstar', urlencodedParser, (req,res) => {
	var data = req.body.data;

	if(data.isStar){
		List.update({uid:data.uid}, {$pull:{star:data.to}}, (err) => {
			res.send(false);
		});
	}else{
		List.findOneAndUpdate(
			{uid:data.uid}, 
			{$addToSet:{star:data.to}},
			{new:true},
		 	(err,p) => {
				res.send(p);
			});
	}
})


router.post('/deleteRecentChat', urlencodedParser, (req,res) => {
	var data = req.body;
	var type = data.type;
	var uid = data.uid;
	var to = data.to;

	List.update({uid:data.uid}, {$pull:{recent_people:data.to}},(err) => {
		if(err) throw err;
		res.send(true);
	})
});


module.exports = router;