const assert = require('assert');
const crypto = require('crypto')
const path = require('path');
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const User = require('./mongoModel/user');
const Unread = require('./mongoModel/unread');
const People = require('./mongoModel/people');
const Team = require('./mongoModel/team');
const Loginlist = require('./mongoModel/loginlist');
const Message = require('./mongoModel/message');
const Tmessage = require('./mongoModel/tmessage');

for(let i = 0; i<10; i++){
	let hash = crypto.createHash('sha1');
	hash.update('123456789')
	let password = hash.digest('hex');

	let uid = 'z0000'+i, UN = { uid };

	let user = new User({
        uid,
        password,
        login:false,
    });

	let unread = new Unread({
		uid,
		punRead:{
			"z00001":3,
            "z00002":2,
		},
		tunRead:{
			"z00001":3,
            "z00002":4,
			"z00003":5
		}
	}); 
	let people = new People({
		uid,
		headImg:'/img/defaultHead.jpg',
		sex : '保密',
    	name : '未命名',
    	introduce:'这家伙很懒,什么也没有写.',
    	hobby : '保密',
    	birthday : '保密',
	});
	let loginlist = new Loginlist({
		uid,
        recent_people:["z00001","z00002"],
        recent_team:["z00001","z00002","z00003"],
		star:[],
		team:["z00001","z00000"],
	});
	let message = new Message({
		uid,
		mess:{
			'0':'0',
			"z00001" : [
            {
                "uid" : "z00003",
                "to" : "z00001",
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "10.7  11:4",
                "content" : "牙时拉你梁非凡",
                "introduce" : "这家伙很懒,什么也没有写."
            },
            {
                "uid" : "z00001",
                "to" : "z00003",
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "10.7  11:7",
                "content" : "听广你好串窝",
                "introduce" : "这家伙很懒,什么也没有写."
            },
            {
                "uid" : "z00003",
                "to" : "z00001",
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "10.7  11:4",
                "content" : "牙时拉你梁非凡",
                "introduce" : "这家伙很懒,什么也没有写."
            },
        ],
        "z00002" : [
            {
                "uid" : "z00003",
                "to" : "z00001",
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "10.7  11:4",
                "content" : "牙时拉你梁非凡",
                "introduce" : "这家伙很懒,什么也没有写."
            },
            {
                "uid" : "z00001",
                "to" : "z00003",
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "10.7  11:7",
                "content" : "听广你好串窝",
                "introduce" : "这家伙很懒,什么也没有写."
            }
        ]
		},
	});




    var team = new Team({
        headImg:'/img/defaultHead.jpg',
        uid:'z0000'+i,
        name:"TEAM"+i,
        password:123456,
        level:10,
        member:["z00000","z00001","z00002","z00003","z00004","z00005","z00006","z00007","z00008","z00009"],
        membernumber:1,
        introduce:'This team does not have a introduce presently',
    });
    var tmessage = new Tmessage({
        uid:'z0000'+i, 
        mess:[
            {
                uid:'z00001',
                headImg:"/img/defaultHead.jpg",
                name:"POKER",
                time:"12:00",
                content:"44444!"
            },
            {
                uid:'z00001',
                headImg:"/img/defaultHead.jpg",
                name:"JTALKER",
                time:"12:01",
                content:"55555!"
            },
            {
                uid:'z00001',
                headImg:"/img/defaultHead.jpg",
                name:"JOKER",
                time:"12:02",
                content:"666666!"
            },
        ]
    });
        team.save();
        tmessage.save();
		user.save();
		unread.save();
		people.save();
		loginlist.save();
		message.save();
}


