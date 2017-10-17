const babel = require('babel-core');
const fs = require('fs');
const express = require('express');
const app = express();
const CHECK = require('./routes/lib/check.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes/routes')(app);
const time = require('./routes/lib/retime');
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


io.on('connection', function(socket){
socket.on('chat',function(J_msg){
  var msg = JSON.parse(J_msg);
  CHECK(msg,'chat_msg');

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



// 判断接收方是否在线
// 如果接收方处于离线状态，为其 unreadnumber+1
// This part has the limit that it can not use session, 
//  So we could use db to record if the use login.
    User.find({uid:msg.to}, 'login', { limit: 1 }, (err,detail)=>{
      var islogin = detail[0].login;
      if(islogin){
        //If the receiver is logining.
        console.log('(user)'+msg.from+' send a message to (user)'+msg.to);
        io.emit(msg.to,J_m);
      }else{
        Unread.find({uid:msg.to},'punReadNumber',{limit:1},(err,detail)=>{
          //Get the unread number of message of msg.from of msg.to and +1 
          var punread = detail[0].punReadNumber;
          CHECK(punread,'(1)(user)'+msg.to+' punread:');
          if(!punread[msg.from]){
            punread[msg.from] = 0;
          }
          punread[msg.from] = punread[msg.from] + 1;
          CHECK(punread,'(2)(user)'+msg.to+' punread:');
          Unread.update({uid:msg.to},{$set:{punReadNumber:punread}},(err)=>{
            console.log('Make (user)'+msg.to+ ' unread of (user)'+msg.from+' +1 !');
          });
        })
      }
    })




      io.emit(msg.from,J_m);

      //为msg.from和msg.to添加消息
      Message.find({uid:msg.to},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.from]){ mess[msg.from]=[]; }
        mess[msg.from].push(m);
        Message.update({uid:msg.to},{$set:{mess}},(err)=>{})
      })
      Message.find({uid:msg.from},(err,detail)=>{
        let mess = detail[0].mess;
        if(!mess[msg.to]){ mess[msg.to]=[]; }
        mess[msg.to].push(m);
        Message.update({uid:msg.from},{$set:{mess}},(err)=>{})
      });







      //当出现一条msg，
      //让msg.from的loginlist.recent增加msg.to;
      Loginlist.find({uid:msg.from},(err,detail)=>{
        for(let i of detail[0].recent.people){
          if(i===msg.to){ 
            console.log("msg.from already had the msg in recent!");
            return false; 
          } 
        }
        var recent = detail[0].recent;
        recent.people.push(msg.to);
        console.log("recent.people of msg.from:")
        console.log(recent.people);
        Loginlist.update({uid:msg.from},{$set:{recent}},(err)=>{
          console.log("Update loginlist in recent for " +msg.from+" !");
        })
      });
    
      //让msg.to的loginlist.recent增加msg.from;
      Loginlist.find({uid:msg.to},(err,detail)=>{
        for(let i of detail[0].recent.people){
          if(i===msg.from){ 
            console.log("msg.to already had the msg in recent!");
            return false;
          }
        }
        var recent = detail[0].recent;
        recent.people.push(msg.from);
        console.log("recent.people of msg.to:")
        console.log(recent.people);
        Loginlist.update({uid:msg.to},{$set:{recent}},(err)=>{
          console.log("Update loginlist in recent for msg.to!");
        })
      })



  }else{
    //如果这个消息是来自某个团队
    Tmessage.update({uid:msg.to},{$push:{mess:m}},(err)=>{});
    Team.find({uid:msg.to},(err,detail)=>{
      CHECK(detail[0],'Chat_Team');
      var member = detail[0].member;
      // var m = {
      //   uid:msg.from,
      //   to:msg.to,
      //   type:msg.type,
      //   headImg:detail[0].headImg,
      //   name:detail[0].name,
      //   time:msg.time,
      //   content:msg.content,
      //   introduce:detail[0].introduce,
      // };

      var tm = m;
      //because msg.to is the uid of this team;
      tm.uid = msg.to;
      //msg.from is who say the msg:
      tm.from = msg.from;
      CHECK(tm,'team_messssss');
      member.forEach(a=>{
        tm.to = a;
        var J_tm = JSON.stringify(tm);
        io.emit(a,J_tm);
      })
    })
  }
});
});
});


const ip = '127.0.0.1';
const port = 8000;

server.listen(port,ip,function(){
  console.log(ip+':'+port);
})
