const CHECK = require('./lib/check');
const assert = require('assert');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
const time = require('./lib/retime');
const mongoose=require('mongoose');
const User = require('../mongoModel/user');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const loginlist = require('../mongoModel/loginlist');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router()


//people
router.post('/people',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = req.body;
	if(sess.info[data.uid]){
		var info = sess.info[data.uid];
		res.render('afterL/people.ejs',{
			uid:info.uid,
			headImg:info.headImg,
			name:info.name,
			sex:info.sex,
			introduce:info.introduce,
			hobby:info.hobby,
			birthday:info.birthday,
		})
	}else{
		People.find({uid:data.uid},(err,detail)=>{
			if(!sess.info){
				sess.info = {};
			}
			if(detail[0]&&!sess.info[data.uid]){
				sess.info[data.uid] = detail[0];
			}
			var info = sess.info[data.uid];
			res.render('afterL/people.ejs',{
				uid:info.uid,
				headImg:info.headImg,
				e_mail:sess.email[data.uid],
				name:info.name,
				sex:info.sex,
				introduce:info.introduce,
				hobby:info.hobby,
				birthday:info.birthday,
			})
		})
	}
})

//peoples images uploads
router.post('/peopleI',upload.any(),(req,res)=>{
	var sess = req.session;
	var files = req.files;
	var data = req.body;
	var image = files[0];

	var info = sess.info[data.uid];

	var filename = '/img/uploads/'+image.filename;
	
	People.update({uid:data.uid},{$set:{headImg:filename}},(err)=>{
		if(err) throw err;
		sess.info[data.uid].headImg = filename;
		res.render('afterL/people.ejs',{
			uid:info.uid,
			headImg:info.headImg,
			name:info.name,
			sex:info.sex,
			introduce:info.introduce,
			hobby:info.hobby,
			birthday:info.birthday,
		})
	})
})

//peoples text uploads
router.post('/peopleT',urlencodedParser,(req,res)=>{
	var sess = req.session;
	var data = JSON.parse(req.body.J_data);
	CHECK(data);
		for(var para in data){
			sess.info[data.uid][para] = data[para];
		}

		res.send(req.body.J_data);

	People.update({uid:data.uid},{$set:data},(err)=>{
		if(err) throw err;
	});
})





// router.post('/Blob_test',urlencodedParser,(req,res)=>{
// 	var sess = req.session;
// 	var data = req.body;
// 	CHECK(data);

// 	// var img = req.files;
// 	// CHECK(img);
// 	// fs.writeFile('dataURL',dataURL,function(){
// 	// 	console.log('File had write.')
// 	// })
// 	// res.send(req.body.J_data);
// })







// router.post('/dataURL_test',urlencodedParser,(req,res)=>{
// 	var sess = req.session;
// 	var data = JSON.parse(req.body.J_data);
// 	var dataURL = data.url;

// 	fs.writeFile('dataURL',dataURL,function(){
// 		console.log('File had write.')
// 	})
// 	res.send(req.body.J_data);
// })







module.exports = router;  
