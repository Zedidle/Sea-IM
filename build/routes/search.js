const {
	router,
	urlencodedParser,
	List,
	People,
	Team,
	Unread,

} = require('../../configs/server.config.js');


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



router.get('/searchTeam', (req,res) => {
	console.log('-----searchTeam-----');
	let keyword = req.query.keyword;
	let reg = new RegExp(keyword, 'i'); //不区分大小写

	console.log('keyword:');
	console.log(keyword);

	Team.find({
		$or : [ //多条件，数组
			{uid : {$regex : reg}},
			{name : {$regex : reg}}
		] 
	},(err,t) => {
		res.send(t);
	});
});

router.post('/toJoin',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	let tid = req.body.tid;

	List.update({uid},{$addToSet:{team:tid}},(err)=>{
		console.log('add the tid to the list');
		Team.update({uid:tid},{$addToSet:{member:uid}},(err)=>{
			console.log('add the uid to the team member');
			res.send(true);
		});
	});


});

module.exports = router;