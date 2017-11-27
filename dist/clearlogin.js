const mongoose=require('mongoose');
const User = require('./mongoModel/user');

User.update({},{$set:{login:false}},{multi:true},(err)=>{ console.log("All user logout!");})
