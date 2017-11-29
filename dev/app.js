const babel = require('babel-core');
const fs = require('fs');
const express = require('express');
const app = express();
const LIB = require('./routes/lib.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes/routes')(app);
const path = require('path');
const mongoose=require('mongoose');
const User = require('./mongoModel/user');
const Unread = require('./mongoModel/unread');
const Message = require('./mongoModel/message');
const Tmessage = require('./mongoModel/tmessage');
const People = require('./mongoModel/people');
const Team = require('./mongoModel/team');
const Loginlist = require('./mongoModel/loginlist');


//设置公共静态路由
app.use(express.static(path.join(__dirname, 'public')));

//every 10 mins make login status of all users logout,  
// setInterval(function(){
//   User.update({},{$set:{login:false}},{multi:true},(err)=>{ console.log("All user logout!");})
// },600000);

User.update({},{$set:{login:false}},{multi:true},(err)=>{ console.log("All user logout!");})

io.on('connection', function(socket){
  socket.on('loginjudge',function(uid){
    User.update({uid},{$set:{login:true}},err=>{ console.log(uid + ' login'); });
    setTimeout(function(){
      User.update({uid},{$set:{login:false}},err=>{ console.log(uid + ' logout'); });
    },19000);
  });

socket.on('chat',function(J_msg){
  var msg = JSON.parse(J_msg);
  LIB.check(msg,'chat the message:');

  People.find({uid:msg.from},null,{limit:1},(err,detail)=>{
      var m = {
        uid:msg.from,
        to:msg.to,
        type:msg.type,
        headImg:detail[0].headImg,
        name:detail[0].name,
        time:msg.time,
        content:msg.content,
        introduce:detail[0].introduce,
      },
      J_m = JSON.stringify(m);

    if(msg.type!=='team'){

// judge if the receiver is online, 
// if the recevier is outline, make the unreadnumber +1.
// this part has the limit that it can not use session, 
// so I use db to record login status of the user,
    User.find({uid:msg.to}, 'login', { limit: 1 }, (err,detail)=>{
      if(detail[0].login){
        //If the receiver is logining.
        console.log('(user)'+msg.from+' send a message to (user)'+msg.to);
        io.emit(msg.to,J_m);
      }else{
        Unread.find({uid:msg.to},'punRead',{limit:1},(err,detail)=>{
          //Get the unread number of message and make it +1, 
          var punRead = detail[0].punRead;
          LIB.check(punRead,'(1)(user)'+msg.to+' punread:');
          if(!punRead[msg.from]){ punRead[msg.from] = 0; }
          punRead[msg.from] = punRead[msg.from] + 1;
          LIB.check(punRead,'(2)(user)'+msg.to+' punread:');
          Unread.update({uid:msg.to},{$set:{punRead}},(err)=>{
            console.log('Make (user)'+msg.to+ ' unread of (user)'+msg.from+' +1 !');
          });
        })
      }
    })

      io.emit(msg.from,J_m);

      //为msg.from和msg.to添加消息
      Message.find({uid:msg.to},null,{limit:1},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.from]){ mess[msg.from]=[]; }
        mess[msg.from].push(m);
        Message.update({uid:msg.to},{$set:{mess}},(err)=>{})
      })
      Message.find({uid:msg.from},null,{limit:1},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.to]){ mess[msg.to]=[]; }
        mess[msg.to].push(m);
        Message.update({uid:msg.from},{$set:{mess}},(err)=>{})
      });

      //make loginlist.recent_people of msg.from addToSet msg.to,
      //the third argument of update is used to decide whether update all contents that is meeting the condition,
      Loginlist.update({uid:msg.from},{$addToSet:{recent_people:msg.to}},{multi:false},(err)=>{});
      //make loginlist.recent_people of msg.to addToSet msg.from,
      Loginlist.update({uid:msg.to},{$addToSet:{recent_people:msg.from}},{multi:false},(err)=>{});

  }else{
    //如果这个消息是来自某个团队
      Team.find({uid:msg.to},'member',(err,detail)=>{
        LIB.check(detail[0],'Chat_Team');
        var members = detail[0].member;
        var tm = m;
        //msg.to is the uid of the team,
        tm.uid = msg.to;
        //msg.from is the person who said the message,
        tm.from_user = msg.from;
        LIB.check(tm,'messages of the team:');
        teamBroadcast(members,tm);
        Tmessage.update({uid:msg.to},{$push:{mess:tm}},(err)=>{});
      })
    }
});
});
});



const ip = '127.0.0.1';
const port = 8000;

server.listen(port,ip,function(){console.log(ip+':'+port);});



function teamBroadcast(members,msgToTeam){
  members.forEach(toWhom=>{
    msgToTeam.to = toWhom;
    var J_tm = JSON.stringify(msgToTeam);
    io.emit(toWhom,J_tm);
  })
}