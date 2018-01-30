var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tmessageSchema = new Schema({
    uid:String,
    mess:Array,
    // var mess = [{
    //    "uid" : "z00003",
    //    "to" : Same as the receiver,
    //    "type" : "team",
    //    "headImg" : "/img/uploads/9a5945c63c48bad2290a1c19c2dc0359",
    //    "name" : "",
    //    "time:": "",
    //    "content": "",
    //    "introduce": "",
    //    "from_user" : ""  
    // },
    // ...
    // ]
})

var Tmessage = mongoose.model('Tmessage', tmessageSchema);
module.exports = Tmessage;
