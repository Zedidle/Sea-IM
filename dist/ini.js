const assert = require('assert');
const crypto = require('crypto')
const path = require('path');
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const User = require('./mongoModel/user');
const People = require('./mongoModel/people');
const Team = require('./mongoModel/team');
const Loginlist = require('./mongoModel/loginlist');
const Message = require('./mongoModel/message');
const Tmessage = require('./mongoModel/tmessage');

for(let i = 0; i<3; i++){
	let hash = crypto.createHash('sha1');
	hash.update('123456789')
	let password = hash.digest('hex');

	let uid = 'z0000'+i, UN = { uid };

	let user = new User({ uid, password });

	let people = new People({
		uid,
		headImg:'/img/defaultHead.jpg',
		sex : '保密',
    name : '未命名',
    introduce:'这家伙很懒,没写简介．',
    hobby : '保密',
    birthday : '保密',
	});
	let loginlist = new Loginlist({
		uid,
		recent:[],
		star:[],
		team:[],
		stranger:[],
	});
	let message = new Message({
		uid,
		unReadNumber:{'0':'0'},
		TunReadNumber:{'0':'0'},
		mess:{'0':'0'},
	});

	new Promise((resolve)=>{
		let tipUN;
		User.find(UN,(err, detail)=>{
		(detail.length===0)?tipUN=false:tipUN=true;
		resolve(tipUN);
	});
  	}).then((tipUN)=>{
			user.save()
			people.save();
			loginlist.save();
			message.save();
});
}


