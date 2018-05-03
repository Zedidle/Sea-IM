module.exports = function(mongoose){
    return mongoose.model('Team',new mongoose.Schema({
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
        member: {
            type: Array,
            default: []
        },
        introduce:{
            type:String,
            default:'队长暂时没有话要说。'
        },
    }));
};