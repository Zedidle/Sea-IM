var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//骨架模版
var userSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
    uid:String,
    password:String,
    login:{
    	type:Boolean,
    	default:false
    }
})

var User = mongoose.model('User', userSchema);
module.exports = User;
