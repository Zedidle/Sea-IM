var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var unReadSchema = new Schema({
    uid:String,
    punReadNumber:Object,
    tunReadNumber:Object,

    // unReadNumber={
    // 	u1:number,
    // 	u2:number,
    // 	...
    // }

    // mostly 4 team;
    // tunReadNumber={
    //  u1:number,
    //  u2:number,
    //  u3:number,
    //  u4:number,
    // }

});

var Unread = mongoose.model('Unread', unReadSchema);
module.exports = Unread;