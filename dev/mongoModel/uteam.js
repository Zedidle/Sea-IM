var mongoose = require("mongoose");mongoose.Promise = global.Promise;  
mongoose.connect('mongodb://localhost/test',{useMongoClient:true});
var Schema = mongoose.Schema;

var uteamSchema = new Schema({
    uid:String,
    team:Array,
})

var Uteam = mongoose.model('Uteam', uteamSchema);
module.exports = Uteam;