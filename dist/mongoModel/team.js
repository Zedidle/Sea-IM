var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	headImg:String,
	id:String,
    teamname: String,
    password:String,
    level:Number,
    major: String,
    member: Array,
    membernumber:Number,
    introduce:String,
})

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;