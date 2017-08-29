var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    username:String,
    mess:Array,
 	// 	var mess={
	// 	from:{
	// 		username:String,
	// 		nickname:String,
	// 	},
	// 	body:{
	// 		content,
	// 		time,
	// 	},
	// }

	// var time = new Date();
	// var month = parseInt(time.getMonth())+1;
	// time = time.getFullYear()+'.'+month+ '.' +time.getDate()+' '+time.getHours()+':'+time.getMinutes();
})

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
