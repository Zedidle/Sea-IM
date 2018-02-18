const {
	router,
	urlencodedParser,
	// multer,
	upload,
	People,
	fs,
	List,
} = require('../../configs/server.config.js');

router.post('/meUpdateText',urlencodedParser,(req,res)=>{
	let data = req.body;
	console.log('meUpdateText');
	console.log('data:');
	console.log(data);
	People.update({uid:data.uid},{$set:data},(err)=>{
		console.log('success me update text');
		res.send(data);
	});
});


// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../public/uploads/pImages/');
//   },
//   filename: function (req, file, cb) {
//   	console.log('The file is:');
//   	console.log(file);
//     cb(null, file.filename);
//   }
// })

// let upload = multer({dest:'../public/uploads/'});

//used by views/people.ejs
router.post('/meUpdateImage', upload.any(), (req,res) => {
	console.log('-------meUpdateImage-------');

	let uid = req.body.uid;
	let img = req.files[0];

	// console.log('UID:',uid);
	// console.log('The new filename of image:');
	// console.log(img.filename);
	console.log('the image:');
	console.log(img);

	let headImg = 'uploads/'+img.filename;
	People.update({ uid }, { $set:{ headImg }}, (err) => {
		res.send(headImg);
	});
});

router.post('/addStar',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	let sid = req.body.sid;
	console.log('req.body:');
	console.log(req.body);

	console.log('uid,sid...');
	console.log(uid,sid);

	List.update({uid},{$addToSet:{star:sid}},(err)=>{
		console.log('add star successfully!');
		res.send(true);
	});
});

router.post('/removeStar',urlencodedParser,(req,res)=>{
	let uid = req.body.uid;
	let sid = req.body.sid;
	console.log('req.body:');
	console.log(req.body);

	console.log('uid,sid...');
	console.log(uid,sid);

	List.update({uid},{$pull:{star:sid}},(err)=>{
		console.log('remove star successfully!');
		res.send(true);
	});
});


module.exports = router;  