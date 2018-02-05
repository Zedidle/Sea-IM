var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loginlistSchema = new Schema({
	createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    uid:{
    	type: String,
    	unique: true
    },
    recent_people:{
        type:Array,
        default:[],
    },
    recent_team:{
        type:Array,
        default:[],
    },
    star:{
        type:Array,
        default:[],
    },
    team:{
        type:Array,
        default:[],
    }
})

var Loginlist = mongoose.model('Loginlist', loginlistSchema);
module.exports = Loginlist;