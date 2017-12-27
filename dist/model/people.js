var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//骨架模版
var peopleSchema = new Schema({
	createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
	uid:String,
	headImg:{
		type: String,
		default: '/img/defaultHead.png'
	},
    name : String,
    introduce:String,
    hobby : String,
    birthday : String,
    sex : String,
})

var People = mongoose.model('People', peopleSchema);
module.exports = People;