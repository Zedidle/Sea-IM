module.exports = function(mongoose){
	return mongoose.model('User', new mongoose.Schema({
	    createTime: { type: Date, default: Date.now, index: true },
	    updateTime: { type: Date, default: Date.now },
	    uid:String,
	    password:String,
	    login:{
	    	type:Boolean,
	    	default:false
	    }
	}));
};
