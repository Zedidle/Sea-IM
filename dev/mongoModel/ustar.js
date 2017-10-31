var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var ustarSchema = new Schema({
    uid:String,
    star:Array,
})

var Ustar = mongoose.model('Ustar', ustarSchema);
module.exports = Ustar;