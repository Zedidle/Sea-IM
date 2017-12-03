var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
	uid:String,
    name: String,
	headImg:String,
    password:String,
    level:Number,
    member: Array,
    membernumber:Number,
    introduce:String,
})

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;