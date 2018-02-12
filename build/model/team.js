var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
	uid: String,
    name: String,
    headImg:{
        type: String,
        default: '/img/teamDefaultHead.jpg'
    },
    password:String,
    level:{
        type:Number,
        default:1   
    },
    member: Array,
    introduce:{
        type:String,
        default:'队长暂时没有话要说。'
    },
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;