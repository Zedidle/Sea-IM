module.exports = function(mongoose){
    return mongoose.model('Tmess',new mongoose.Schema({
        uid:String,
        mess:{
            type:Array,
            default:[],   
        },
        // [
        //  {
        //    "uid" : "z00003",
        //    "to" : Same as the receiver,
        //    "type" : "team",
        //    "headImg" : "/img/uploads/9a5945c63c48bad2290a1c19c2dc0359",
        //    "name" : "",
        //    "time:": "",
        //    "content": "",
        //    "introduce": "",
        //    "from_user" : ""  
        //  },
        // ...
        // ]
    }));
}
