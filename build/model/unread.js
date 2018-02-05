var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var unReadSchema = new Schema({
    uid:String,
    punRead:{
        type:Object,
        default:{ _:''}
    },
    tunRead:{
        type:Object,
        default:{ _:''}
    }

    // punRead={
    // 	u1:number,
    // 	u2:number,
    // 	...
    // }


    // mostly 4 team;
    // tunRead={
    //  u1:number,
    //  u2:number,
    //  u3:number,
    //  u4:number,
    // }

});

var Unread = mongoose.model('Unread', unReadSchema);
module.exports = Unread;