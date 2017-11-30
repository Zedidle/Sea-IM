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


User.remove({},err=>{
Unread.remove({},err=>{
People.remove({},err=>{
Loginlist.remove({},err=>{
Team.remove({},err=>{
Message.remove({},err=>{
Tmessage.remove({},err=>{














for(let i = 0; i<10; i++){
	let hash = crypto.createHash('sha1');
	hash.update('123456789')
	let password = hash.digest('hex');

	let uid = 'z0000'+i;

	let user = new User({
        uid,
        password,
        login:false,
    });

	let unread = new Unread({
		uid,
		punRead:{
			"z00001":2,
            "z00002":2,
		},
		tunRead:{
            "z00001":2,
			"z00002":2,
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
        recent_team:["z00001","z00002"],
		star:[],
		team:["z00001","z00002"],
	});
	let message = new Message({
		uid,
		mess:{
		'0':'0',
		"z00001" : [
            {
                "uid" : "z00001",
                "to" : "z0000"+i,
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "11.27",
                "content" : "2233 You are most fat one.",
                "introduce" : "这家伙很懒."
            },
            {
                "uid" : "z00001",
                "to" : "z0000"+i,
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "11.27",
                "content" : "3322 My Lover is ok!",
                "introduce" : "这家伙很懒."
            },
        ],
        "z00002" : [
            {
                "uid" : "z00002",
                "to" : "z0000"+i,
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "11.28",
                "content" : "Godlike!",
                "introduce" : "这家伙很懒."
            },
            {
                "uid" : "z00002",
                "to" : "z0000"+i,
                "type" : "recent",
                "headImg" : "/img/defaultHead.jpg",
                "name" : "未命名",
                "time" : "11.28",
                "content" : "Dominating!",
                "introduce" : "这家伙很懒."
            }
        ]
        },
    });
        user.save();
        unread.save();
        people.save();
        loginlist.save();
        message.save();
}





    var team = new Team({
        headImg:'/img/defaultHead.jpg',
        uid:'z00001',
        name:"TEAM1",
        password:123456,
        level:3,
        member:["z00000","z00001","z00002","z00003","z00004","z00005","z00006","z00007","z00008","z00009"],
        membernumber:10,
        introduce:'This team does not have a introduce presently',
    });


    var tmessage = new Tmessage({
        uid:'z00001', 
        mess:
        [
            {
                uid:'z00001',
                to:'z00000000',
                type:'team',
                headImg:"/img/defaultHead.jpg",
                name:"POKER",
                content:"44444!",
                time:"12:00",
                introduce:"This guy is very lazy!",
                from_user:'z00000',
            },
            {
                uid:'z00001',
                to:'z00000000',
                type:'team',
                headImg:"/img/defaultHead.jpg",
                name:"POKER",
                content:"55555!",
                time:"12:01",
                introduce:"This guy is very lazy!",
                from_user:'z00000',
            },
        ]
    });
    team.save();
    tmessage.save();




    var team1 = new Team({
        headImg:'/img/defaultHead.jpg',
        uid:'z00002',
        name:"TEAM2",
        password:123456,
        level:4,
        member:["z00000","z00001","z00002","z00003","z00004","z00005","z00006","z00007","z00008","z00009"],
        membernumber:10,
        introduce:'This team does not have a introduce presently',
    });


    var tmessage1 = new Tmessage({
        uid:'z00002', 
        mess:
        [
            {
                uid:'z00002',
                to:'z00000000',
                type:'team',
                headImg:"/img/defaultHead.jpg",
                name:"FAKER",
                content:"EEEEE!",
                time:"13:00",
                introduce:"This guy is very lazy!",
                from_user:'z00000',
            },
            {
                uid:'z00002',
                to:'z00000000',
                type:'team',
                headImg:"/img/defaultHead.jpg",
                name:"FAKER",
                content:"ZZZZZ!",
                time:"13:01",
                introduce:"This guy is very lazy!",
                from_user:'z00000',
            },
        ]
    });
    team1.save();
    tmessage1.save();






console.log('finish to initial db');

});
});
});
});
});
});
});