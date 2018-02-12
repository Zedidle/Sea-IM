var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listSchema = new Schema({
	createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    uid:{
    	type: String,
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

var List = mongoose.model('List', listSchema);
module.exports = List;