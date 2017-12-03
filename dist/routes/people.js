const LIB = require('./lib');
const crypto = require('crypto')
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' });
const mongoose=require('mongoose');
const User = require('../../model/user');
const Unread = require('../../model/unread');
const Message = require('../../model/message');
const Tmessage = require('../../model/tmessage');
const People = require('../../model/people');
const Team = require('../../model/team');
const Loginlist = require('../../model/loginlist');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router()


//used by public/js/main.js g77
router.post('/people',urlencodedParser,(req,res)=>{
	var data = req.body;
	LIB.userFakeLogout(User,data.uid);
	People.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var info = detail[0];
		res.render('people.ejs',{
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

//used by views/people.ejd g158
//peoples images uploads
router.post('/peopleI',upload.any(),(req,res)=>{
	var files = req.files;
	var data = req.body;
	var image = files[0];
	var filename = '/img/uploads/'+image.filename;
	
	People.update({uid:data.uid},{$set:{headImg:filename}},err=>{});
	People.find({uid:data.uid},null,{limit:1},(err,detail)=>{
		var info = detail[0];
		res.render('people.ejs',{
			uid:info.uid,
			headImg:filename,
			name:info.name,
			sex:info.sex,
			introduce:info.introduce,
			hobby:info.hobby,
			birthday:info.birthday,
		});
	})
})

//used by public/js/people.js  g61
//peoples text uploads
router.post('/peopleT',urlencodedParser,(req,res)=>{
	var data = JSON.parse(req.body.J_data);
	LIB.check(data,'text information of people to change:');
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