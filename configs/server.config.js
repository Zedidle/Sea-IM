// 全部的后台模块引用
const express = require('express');
const router = express.Router();

const session = require('express-session');  // session

const crypto = require('crypto')  //加密
const fs = require('fs')   //文件系统

const path = require('path'); //路径合并


// post数据上传
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();

// 图片上传
let base = __dirname;
// console.log('The base path:',base);
const multer = require('multer');
const upload = multer({ dest: 'build/public/uploads/' });


var redis = require("redis").createClient();
redis.on("error", function (err) {
    console.log("Error " + err);
});


// 数据库模板
const model = require('../build/model');

/* 自定以方法模块 */
const sequence = require('zfc-sequence');

module.exports = {
	ip: '127.0.0.1',
	port: 8000,
	db: 'mongodb://localhost/seaim',
	
	// z,
	session,
	express,
	router,
	crypto,
	fs,
	path,
	urlencodedParser,
	jsonParser,
	// multer,
	upload,

	User:model.User,
	Unread:model.Unread,
	Pmess:model.Pmess,
	Tmess:model.Tmess,
	People:model.People,
	Team:model.Team,
	List:model.List,

	sequence,
	redis,
}