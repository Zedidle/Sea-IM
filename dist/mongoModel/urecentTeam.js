var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var urecentTeamSchema = new Schema({
    uid:String,
    recentT:Array,
})

var UrecentTeam = mongoose.model('UrecentTeam', urecentTeamSchema);
module.exports = UrecentTeam;