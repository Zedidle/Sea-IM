var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//骨架模版
var peopleSchema = new Schema({
	createTime: { type: Date, default: Date.now, index: true },
    updateTime: { type: Date, default: Date.now },
	uid:{
		type:String,
	},
	headImg:{
		type: String,
		default: '/img/defaultHead.png'
	},
    name :{
    	type: String,
    	default : 'User'+(Math.random()*Math.random()*Math.pow(10,8)).toString().slice(0,8),
    },
    introduce:{
    	type:String,
    	default:'这家伙很懒,什么也没有写.'
    },
    sex : String,
    hobby : {
    	type:String,
    	default:'暂无公布爱好'
    },
    birthday : {
    	type:String,
    	default:'暂无公布生日'
    }
})


var People = mongoose.model('People', peopleSchema);
module.exports = People;