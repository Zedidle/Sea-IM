var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    uid:String,
    unReadNumber:Object,
    TunReadNumber:Object,
    mess:Object,

    // unReadNumber={
    // 	u1:number,
    // 	u2:number,
    // 	...
    // }

    // mess={
    // 	u1:[{content,time},...],
    // 	u2:[{content,time},...],
    // 	...
    // }
})

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
