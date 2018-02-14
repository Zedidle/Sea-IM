// 全部的后台模块引用
// const z = require('zhelp');


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
const multer = require('multer');
const upload = multer({ dest: 'build/public/img/uploads/' });

// 数据库模板
const User = require('../build/model/user');
const Unread = require('../build/model/unread');
const Pmess = require('../build/model/pmess');
const Tmess = require('../build/model/tmess');
const People = require('../build/model/people');
const Team = require('../build/model/team');
const List = require('../build/model/list');


module.exports = {
	ip: '127.0.0.1',
	port: 8000,
	db: 'mongodb://localhost/seanet',
	
	// z,
	session,
	express,
	router,
	crypto,
	fs,
	path,
	urlencodedParser,
	jsonParser,
	upload,
	User,
	Unread,
	Pmess,
	Tmess,
	People,
	Team,
	List,

}