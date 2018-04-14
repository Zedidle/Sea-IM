const {
	router,
	urlencodedParser,
	Pmess,
	Tmess,
	Unread,
	sequence
	
} = require('../../configs/server.config.js');


router.post('/test',urlencodedParser,(req,res)=>{
	let data = JSON.parse(req.body.J_data);
	let J_data = JSON.stringify({
		answer:'finish to test',
	});
	res.send(J_data);
})


//used by public/js/main-method.js
router.post('/unReadTo0', urlencodedParser, (req, res) => {
	let b = req.body; 
	let uid = b.uid;
	let to = b.to;
	let type = b.type;

	//处理用户的未读消息数
	Unread.findOne({ uid }, (err, u) => {
		let unread;
		//根据不同的类型做出不同的处理
		if(type!=='team'){
			unread = u.punRead;
			unread[to] = 0;
			Unread.update({ uid }, {$set:{punRead:unread}}).exec();
		}else{
			unread = u.tunRead;
			unread[to] = 0;
			Unread.update({ uid }, {$set:{tunRead:unread}}).exec();
		}
	});
});

router.post('/unReadAdd1', urlencodedParser, (req, res) => {
	

});



//used by public/js/main.js,
router.get('/getUnreadMess', (req,res) => {
	let data = req.query;
	let unr = parseInt(data.unr);
	let m = [],mess;
	console.log(data);

	if(!unr){ res.send(m); return;}

	if(data.type==='t'){
		console.log('Tmess:');
		Tmess.findOne({uid:data.getUid},(err,d)=>{
			console.log(d);
			if(d){
				mess = d.mess;
				while(unr&&m){ m.unshift(mess.pop()); unr--; }
			}
			res.send(m);
		});
	}else if(data.type==='p'){
		Pmess.findOne({uid:data.uid},(err,d)=>{
			if(d){
				mess = d.mess[data.getUid];
				while(unr&&mess){ m.unshift(mess.pop()); unr--; }
			}
			res.send(m);
		});
	}
})


module.exports = router;
