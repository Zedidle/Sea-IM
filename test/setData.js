const {
	db,
	crypto,
	User,
	Unread,
	List,
	People,
	Pmess,
	Team,
	Tmess,

} = require('../configs/server.config.js');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(db,{useMongoClient:true},(err)=>{
	if(err){
	    console.log('Connect DB Error -->',err);
		/*未知，有待考察。*/
		process.exit(1);
	}
});

/*预设密码888888*/
let password = crypto.createHash('sha1')
	.update('888888')	
	.digest('hex');

/*创建帐号:z00000 - z00003*/
for(let i=0;i<4;i++){



	/*未读信息数的对应建立*/
	let punr = {};
	for(let j=0;j<4;j++){
		if( ('z0000'+j) !== ('z0000'+i)){
			punr['z0000'+j] = 2;
		}
	}

	new Unread({ 
		uid:'z0000'+i,
		punr,
		tunr:{
			z00000:4,
			z00001:4,
			z00002:4,
			z00003:4,
		}
	 }).save();

	let mess = {};
	for(let j=0;j<4;j++){
		if( ('z0000'+j) !== ('z0000'+i)){
			mess['z0000'+j] = [
				{
					uid:'z0000'+j,
					to:'z0000'+i,
					type:"p",
					headImg:'/img/defaultHead.png',
					name:'User'+j,
					time:'2018.02.12',
					content:"Hurry up",
					introduce:'HelloHelloHello'
				},
				{
					uid:'z0000'+j,
					to:'z0000'+i,
					type:"p",
					headImg:'/img/defaultHead.png',
					name:'User'+j,
					time:'2018.02.12',
					content:"Hurry up",
					introduce:'HelloHelloHello'
				}
			];
		}
	}


	new Pmess({
		uid:'z0000'+i,
		mess,
	}).save();


	new Tmess({
		uid:'z0000'+i,
		mess:[
			{
			   uid : "z0000"+i,
			   to :'z0000'+i,
			   type : "t",
			   headImg : "/img/defaultHead.png",
			   name : "User0",
			   time: "08:32",
			   content: "TEST TEAM MESS",
			   from_user : "z00000"
			},
			{
			   uid : "z0000"+i,
			   to :'z0000'+i,
			   type : "t",
			   headImg : "/img/defaultHead.png",
			   name : "User1",
			   time: "08:33",
			   content: "TEST TEAM MESS",
			   from_user : "z00001"
			},
			{
			   uid : "z0000"+i,
			   to :'z0000'+i,
			   type : "t",
			   headImg : "/img/defaultHead.png",
			   name : "User2",
			   time: "08:34",
			   content: "TEST TEAM MESS",
			   from_user : "z00002"
			},
			{
			   uid : "z0000"+i,
			   to :'z0000'+i,
			   type : "t",
			   headImg : "/img/defaultHead.png",
			   name : "User3",
			   time: "08:35",
			   content: "TEST TEAM MESS",
			   from_user : "z00003"
			}
		]
	}).save();




	new People({ 
		uid:'z0000'+i,
		name:'User'+i
	}).save();


	new Team({
		uid:'z0000'+i,
		name:'Team'+i,
		password:888888,
		member:['z00000','z00001','z00002','z00003'],
	}).save();




	let recent_people = [],star = [];
	for(let j=0;j<4;j++){
		if( ('z0000'+j) !== ('z0000'+i) ){
			recent_people.push('z0000'+j);
			star.push('z0000'+j);
		}
	}

	new List({ 
		uid:'z0000'+i,
		recent_people,
		recent_team:[
			'z00000',
			'z00001',
			'z00002',
			'z00003',
		],
		star,
		team:[
			'z00000',
			'z00001',
			'z00002',
			'z00003',
		],

	}).save();



	new User({ uid:'z0000'+i, password }).save();







}

console.log('Created 4 Account!');
console.log('Created 4 Team!');



