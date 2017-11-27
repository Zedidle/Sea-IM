var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var loginlistSchema = new Schema({
    uid:String,
    recent_people:Array,
    recent_team:Array,
    star:Array,
    team:Array,
})

var Loginlist = mongoose.model('Loginlist', loginlistSchema);
module.exports = Loginlist;