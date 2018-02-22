const {
	User,
	Unread,
	People,
	Loginlist,
	Message,
	Tmessage,
	Team,
	db,
} = require('../configs/server.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  
mongoose.connect(db, {useMongoClient:true}, (err) => {
  if(err){
    console.log('connect database error -->',err);
    process.exit(1);
  }
});

User.updateMany({},{$set:{login:false}}).exec((err,d)=>{
	console.log(d);
	console.log('All Logoff, Good Luck!');
});

