const {
	User,
	Unread,
	People,
	List,
	Pmess,
	Tmess,
	Team,
	db,
} = require('../configs/server.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  
mongoose.connect(db, {useMongoClient:true}, (err) => {
  if(err){
    console.log('Connect DB Error -->',err);
    process.exit(1);
  }
});

User.remove({}).exec();
Unread.remove({}).exec();
People.remove({}).exec();
List.remove({}).exec();
Pmess.remove({}).exec();
Tmess.remove({}).exec();
Team.remove({}).exec();


console.log('Clear All Data, Good Luck!');

module.exports = function(){
	console.log('CLEAN:');
	User.remove({}).exec();
	console.log('user');
	Unread.remove({}).exec();
	console.log('unread');
	People.remove({}).exec();
	console.log('people');
	Loginlist.remove({}).exec();
	console.log('loginlist');
	Message.remove({}).exec();
	console.log('message');
	Tmessage.remove({}).exec();
	console.log('tmessage');
	Team.remove({}).exec();
	console.log('team');
}