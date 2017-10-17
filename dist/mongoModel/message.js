var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    uid:String,
    mess:Object,

    // "mess" : {
    //     "0" : "0",
    //     "z00001" : [
    //         {
    //             "uid" : "z00003",
    //             "to" : "z00001",
    //             "type" : "recent",
    //             "headImg" : "/img/uploads/9a5945c63c48bad2290a1c19c2dc0359",
    //             "name" : "未命名",
    //             "time" : "10.7  11:4",
    //             "content" : "牙时拉你梁非凡",
    //             "introduce" : "这家伙很懒,什么也没有写."
    //         },
    //         {
    //             "uid" : "z00001",
    //             "to" : "z00003",
    //             "type" : "recent",
    //             "headImg" : "/img/uploads/e37563d56c498d71f0d2782f99720f75",
    //             "name" : "未命名",
    //             "time" : "10.7  11:7",
    //             "content" : "听广你好串窝",
    //             "introduce" : "这家伙很懒,什么也没有写."
    //         }...
    //     ],
    //     "z00002" : [
    //         {
    //             "uid" : "z00003",
    //             "to" : "z00001",
    //             "type" : "recent",
    //             "headImg" : "/img/uploads/9a5945c63c48bad2290a1c19c2dc0359",
    //             "name" : "未命名",
    //             "time" : "10.7  11:4",
    //             "content" : "牙时拉你梁非凡",
    //             "introduce" : "这家伙很懒,什么也没有写."
    //         },
    //         {
    //             "uid" : "z00001",
    //             "to" : "z00003",
    //             "type" : "recent",
    //             "headImg" : "/img/uploads/e37563d56c498d71f0d2782f99720f75",
    //             "name" : "未命名",
    //             "time" : "10.7  11:7",
    //             "content" : "听广你好串窝",
    //             "introduce" : "这家伙很懒,什么也没有写."
    //         }...
    //     ]
    // },


})

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
