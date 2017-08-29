var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;
//骨架模版
var userSchema = new Schema({
    username   : String,
    password   : String,
    email  : String,
})

var User = mongoose.model('User', userSchema);
module.exports = User;
