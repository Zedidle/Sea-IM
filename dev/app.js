var babel = require('babel-core');
var fs = require('fs');
var express = require('express');
var app = express();
var CHECK = require('./lib/check.js');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var routes = require('./routes/routes')(app);
var time = require('./lib/retime');
var path = require('path');

var mongoose=require('mongoose');

var User = require('./mongoModel/user');
var Message = require('./mongoModel/message');
var Tmessage = require('./mongoModel/tmessage');
var People = require('./mongoModel/people');
var Team = require('./mongoModel/team');
var Peopleteam = require('./mongoModel/peopleteam');
var StarMark = require('./mongoModel/starMark');

app.use(express.static(path.join(__dirname, 'public')));


// babel.transformFile('./public/js/main.js',function(err,result){
//   fs.writeFile('./public/js/main-es5.js',result.code,(err)=>{
//     if(err) throw err;
//     console.log('The file has been saved!');
//   })
// });


//Part:socket.io
io.on('connection', function(socket){

  //stranger and star chat channel
  socket.on('peopleChat', function(J_msg){
    var msg = JSON.parse(J_msg);
    CHECK(msg);

    People.find({username:msg.from},(err,detail)=>{
    	if(err) throw err;
    	var mess={
     		from:{
     			username:msg.from,
     			nickname:detail[0].nickname,
   			},
   			body:{
     			content:msg.content,
     			time:time.ytime(),
   			},
  		}
      io.emit(msg.to,J_msg);
  	Message.update({username:msg.to},{$push:{mess}},(err)=>{
  		if(err) throw err;
   	});
    });
   	
  });


  //Teams chat channel
  socket.on('teamChat',function(J_msg){
  	var msg = JSON.parse(J_msg);
  	CHECK(msg);
    var mess = {
      	from:msg.from,
      	time:msg.time,
      	content:msg.content,
    }
    io.emit('team'+msg.to,J_msg);
    Tmessage.update({id:msg.to},{$push:{mess}},err=>{
      if(err) throw err;
    })
  })

  });






const ip = '127.0.0.1';
const port = 8000;

server.listen(port,ip,function(){
  console.log(ip+':'+port);
})
