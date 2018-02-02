const {
	router,
	urlencodedParser,
	upload,
} = require('../../configs/server.config.js');

//used by public/js/main.js g77
router.post('/people',urlencodedParser,(req,res)=>{
	var data = req.body;
	People.find({uid:data.uid}, null, {limit:1}, (err,person) => {
		if(err) throw err;

		var info = person[0];
		res.render('people.ejs',{
			uid:info.uid,
			headImg:info.headImg,
			name:info.name,
			sex:info.sex,
			introduce:info.introduce,
			hobby:info.hobby,
			birthday:info.birthday
		});
	});
});


//used by views/people.ejs
router.post('/peopleImageUpdate', upload.any(), (req,res) => {
	var uid = req.body.uid;
	var image = req.files[0];
	var readpath = 'img/uploads/'+image.filename;
	console.log(image);
	People.update({ uid }, { $set:{ headImg:readpath }}, (err) => {
		if(err) throw err;
		res.send(readpath);
	});
});


//used by public/js/people.js  g61
//peoples text uploads
router.post('/peopleTextUpdate',urlencodedParser,(req,res)=>{
	var data = req.body;
	People.update({uid:data.uid},{$set:data},(err)=>{
		if(err) throw err;
		res.send(data);
	});
});

module.exports = router;  