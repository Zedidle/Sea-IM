var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;
//骨架模版
var peopleSchema = new Schema({
	username:String,
	headImg:String,
    nickname : String,
    introduce:String,
    hobby : String,
    birthday : String,
    sex : String
})

var People = mongoose.model('People', peopleSchema);
module.exports = People;