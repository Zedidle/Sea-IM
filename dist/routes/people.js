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
const Unread = require('../mongoModel/unread');
const Message = require('../mongoModel/message');
const Tmessage = require('../mongoModel/tmessage');
const People = require('../mongoModel/people');
const Team = require('../mongoModel/team');
const Loginlist = require('../mongoModel/loginlist');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router()


//used by public/js/main.js g77
router.post('/people',urlencodedParser,(req,res)=>{
	var data = req.body;

	People.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var info = detail[0];
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

//used by views/afterL/people.ejd g158
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

//used by public/js/afterL/people.js
//peoples text uploads
router.post('/peopleT',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	CHECK(data,'text information of people to change:');
	res.send(req.body.J_data);
	People.update({uid:data.uid},{$set:data},(err)=>{});
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