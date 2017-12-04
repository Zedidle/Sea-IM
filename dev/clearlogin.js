const mongoose=require('mongoose');
const User = require('../model/user');
User.update({},{$set:{login:false}},{multi:true},(err)=>{ console.log("All user logout!");})
