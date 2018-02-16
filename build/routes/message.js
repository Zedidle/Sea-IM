const {
	router,
	urlencodedParser,
	Tmess,
	Pmess,
	List,
} = require('../../configs/server.config.js');

router.get('/getMoreMessage', (req,res)=>{
	let receiveUid = req.query.receiveUid;
	let fromUid = req.query.fromUid;
	let type = req.query.type;

	console.log('---------getMoreMessage---------')
	console.log('receiveUid:');
	console.log(receiveUid);
	console.log('fromUid:');
	console.log(fromUid);
	console.log('type:');
	console.log(type);

	new Promise((resolve,reject)=>{
		if(type==='p'){
			Pmess.findOne({uid:receiveUid},(err,m) => {
				resolve(m?m.mess[fromUid]:false);
			});
		}else{
			Tmess.findOne({uid:fromUid}, (err,m) => {
				resolve(m?m.mess:false);
			});
		}
	}).then((mess) => {
		console.log('get the messages:')
		console.log(mess);
		res.send(mess);
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