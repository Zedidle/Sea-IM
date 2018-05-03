module.exports = function(mongoose){
    return mongoose.model('Unread', new mongoose.Schema({
        uid:String,
        punr:{
            type:Object,
            default:{ _:''}
        },
        tunr:{
            type:Object,
            default:{ _:''}
        }

        // punr={
        //  u1:number,
        //  u2:number,
        //  ...
        // }


        // mostly 4 team;
        // tunr={
        //  u1:number,
        //  u2:number,
        //  u3:number,
        //  u4:number,
        // }

    }));

};