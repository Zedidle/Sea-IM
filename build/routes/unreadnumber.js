const {
	router,
	urlencodedParser,
	
} = require('../../configs/server.config.js');


router.post('/test',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	var J_data = JSON.stringify({
		answer:'finish to test',
	});
	res.send(J_data);
})


//used by public/js/main-method.js
router.post('/unReadTo0', urlencodedParser, (req, res) => {
	var uid = req.body.uid;
	var to = req.body.to;
	var type = req.body.type;

	//处理用户的未读消息数
	Unread.findOne({ uid }, (err, u) => {
		var unread;
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
	var data = req.query;
	var unread = parseInt(data.unread);
	var mess = [];

	if(!unread){
		res.send(mess);
	}
	console.log(data);

	if(data.type==='team'){
		Tmess.findOne({uid:data.getUid},(err,d)=>{
			if(err) throw err;
			var m = d.mess;
			while(unread&&m){
				mess.unshift(m.pop());
				unread--;
			}
			res.send(mess);
		});
	}else{
		Pmess.findOne({uid:data.uid},(err,d)=>{
			if(err) throw err;
			var mf = d.mess[data.getUid];
			while(unread&&mf){
				mess.unshift(mf.pop());
				unread--;
			}
			res.send(mess);
		});
	}
})


module.exports = router;
