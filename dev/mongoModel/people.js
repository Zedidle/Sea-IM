var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//骨架模版
var peopleSchema = new Schema({
	createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
	uid:String,
	headImg:String,
    name : String,
    introduce:String,
    hobby : String,
    birthday : String,
    sex : String,
})

var People = mongoose.model('People', peopleSchema);
module.exports = People;