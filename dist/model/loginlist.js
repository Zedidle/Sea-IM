var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loginlistSchema = new Schema({
	createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    uid:String,
    recent_people:Array,
    recent_team:Array,
    star:Array,
    team:Array,
})

var Loginlist = mongoose.model('Loginlist', loginlistSchema);
module.exports = Loginlist;