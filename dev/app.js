var babel = require('babel-core');
var fs = require('fs');
var express = require('express');
var app = express();
var CHECK = require('./routes/lib/check.js');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var routes = require('./routes/routes')(app);
var time = require('./routes/lib/retime');
var path = require('path');
var mongoose=require('mongoose');
const User = require('./mongoModel/user');
const Message = require('./mongoModel/message');
const Tmessage = require('./mongoModel/tmessage');
const People = require('./mongoModel/people');
const Team = require('./mongoModel/team');
const Loginlist = require('./mongoModel/loginlist');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
socket.on('chat',function(J_msg){
  var msg = JSON.parse(J_msg);
  CHECK(msg,'chat'); 

  if(msg.type!=='team'){
    People.find({uid:msg.from},(err,detail)=>{
      var m = {
        uid:msg.from,
        type:msg.type,
        headImg:detail[0].headImg,
        name:detail[0].name,
        time:msg.time,
        content:msg.content,
      },
      J_m = JSON.stringify(m);

      io.emit(msg.to,J_m);
      io.emit(msg.from,J_m);

      let m2 = {
        uid:msg.from,
        content:msg.content,
        time:msg.time
      }
      Message.find({uid:msg.to},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.from]){ mess[msg.from]=[]; }
        mess[msg.from].push(m2)
        Message.update({uid:msg.to},{$set:{mess}},(err)=>{})
      })
      Message.find({uid:msg.from},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.to]){ mess[msg.to]=[]; }
        mess[msg.to].push(m2)
        Message.update({uid:msg.from},{$set:{mess}},(err)=>{})
      });

      Loginlist.find({uid:msg.from},(err,detail)=>{
        for(let i of detail[0].recent){
          if(i===msg.to){ return false; }
        }
        Loginlist.update({uid:msg.from},{$push:{recent:msg.to}},(err)=>{})
      })

      Loginlist.find({uid:msg.to},(err,detail)=>{
        for(let i of detail[0].recent){
          if(i===msg.from){ return false; }
        }
        Loginlist.update({uid:msg.to},{$push:{recent:msg.from}},(err)=>{})
      })
    });
  }else{
    Team.find({uid:msg.to},(err,detail)=>{
      CHECK(detail[0],'Chat_Team');
    })
  }

})
});


  // //stranger and star chat channel
  // socket.on('peopleChat', function(J_msg){
  //   var msg = JSON.parse(J_msg);
  //   CHECK(msg); 

  //   People.find({username:msg.from},(err,detail)=>{
  //   	if(err) throw err;
  //   	var mess={
  //    		from:{
  //    			username:msg.from,
  //    			nickname:detail[0].nickname,
  //  			},
  //  			body:{
  //    			content:msg.content,
  //    			time:time.ytime(),
  //  			},
  // 		}
  //     io.emit(msg.to,J_msg);
  // 	Message.update({username:msg.to},{$push:{mess}},(err)=>{});
  //   });
  // });

  // //Teams chat channel
  // socket.on('teamChat',function(J_msg){
  // 	var msg = JSON.parse(J_msg);
  // 	CHECK(msg);
  //   var mess = {
  //     	from:msg.from,
  //     	time:msg.time,
  //     	content:msg.content,
  //   }
  //   io.emit('team'+msg.to,J_msg);
  //   Tmessage.update({id:msg.to},{$push:{mess}},err=>{})
  // })
  // });



const ip = '127.0.0.1';
const port = 8000;

server.listen(port,ip,function(){
  console.log(ip+':'+port);
})
