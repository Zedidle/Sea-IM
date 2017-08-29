var mongoose = require("mongoose");
mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var QASchema = new Schema({
    username   : String,
    QA1:{
    	Q:String,
    	A:String,
    },
    QA2:{
    	Q:String,
    	A:String,
    },
})

var QA = mongoose.model('QA', userSchema);
module.exports = QA;

