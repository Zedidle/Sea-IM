var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var urecentPeopleSchema = new Schema({
    uid:String,
    recentP:Array,
})

var UrecentPeople = mongoose.model('UrecentPeople', urecentPeopleSchema);
module.exports = UrecentPeople;