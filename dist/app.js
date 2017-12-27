const fs = require('fs');
const express = require('express');
const app = express();
const LIB = require('./routes/lib.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes/routes')(app);
const path = require('path');
const mongoose=require('mongoose');
const User = require('./model/user');
const Unread = require('./model/unread');
const Message = require('./model/message');
const Tmessage = require('./model/tmessage');
const People = require('./model/people');
const Team = require('./model/team');
const Loginlist = require('./model/loginlist');

mongoose.Promise = global.Promise;  

mongoose.connect('mongodb://localhost/test',{useMongoClient:true},err=>{
  if(err){
    console.log('connect database error -->',err);
    process.exit(1);
  }
});

User.update({},{$set:{login:false}},{multi:true},(err)=>{
  if(err) throw err;
  console.log("All user logout!");
})

//设置公共静态路由
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',__dirname + "/views");
app.get('*', function(req, res){
    res.render('404.ejs', {

    });
});



io.on('connection', function(socket){

  //receive the heartbeat package ,and keep the user on line;
  socket.on('heartbeat',function(uid){
    User.update({uid},{$set:{login:true}},(err) => { 
      console.log(uid + ' login');
    });
    setTimeout(function(){
      User.update({uid},{$set:{login:false}},(err) => { 
        console.log(uid + ' logout'); 
      });
    },19000);
  });

  socket.on('chat',function(J_msg){

    var msg = JSON.parse(J_msg);
    console.time(1);
    People.find({uid:msg.from},null,{limit:1},(err,pinfo)=>{
      var m = {
        uid:msg.from,
        to:msg.to,
        type:msg.type,
        headImg:pinfo[0].headImg,
        name:pinfo[0].name,
        time:msg.time,
        content:msg.content,
        introduce:pinfo[0].introduce
      },
      J_m = JSON.stringify(m);
    console.timeEnd(1);

      if(msg.type!=='team'){

        // judge if the receiver is online, 
        // if the recevier is outline, make the unreadnumber +1.
        // use database to record login status of the user,
        User.find({uid:msg.to}, null, { limit: 1 }, (err,detail) => {
          LIB.check(detail[0],'To:');
          if(detail[0].login){
            //if the receiver is logining.
            io.emit(msg.to,J_m);
          }else{
            Unread.find({uid:msg.to},'punRead',{limit:1},(err,detail) => {
              //Get the unread number of message and make it +1, 
              var punRead = detail[0].punRead;
              if(!punRead[msg.from]){ punRead[msg.from] = 0; }
              punRead[msg.from] = punRead[msg.from] + 1;
              Unread.update({uid:msg.to},{$set:{punRead}},(err) => {

              });
            })
          }
        })

        io.emit(msg.from,J_m);

        //add the message to the receiver and sender.
        Message.find({uid:msg.to},null,{limit:1},(err,detail) => {
          console.time('XXX');
          let mess = detail[0].mess;
          if(!mess[msg.from]){ 
            mess[msg.from]=[];
          }
          mess[msg.from].push(m);
          Message.update({uid:msg.to},{$set:{mess}},(err) => {
          console.timeEnd('XXX');

          });
        })
        Message.find({uid:msg.from},null,{limit:1},(err,detail) => {
          console.time('X');
          let mess = detail[0].mess;
          if(!mess[msg.to]){
            mess[msg.to]=[];
          }
          mess[msg.to].push(m);
          Message.update({uid:msg.from},{$set:{mess}},(err) => {
          console.timeEnd('X');
          });
        });

        //make loginlist.recent_people of msg.from addToSet msg.to,
        //the third argument of update is used to decide whether update all contents that is meeting the condition,
        Loginlist.update({uid:msg.from},{$addToSet:{recent_people:msg.to}},{multi:false},(err) => {

        });
        //make loginlist.recent_people of msg.to addToSet msg.from,
        Loginlist.update({uid:msg.to},{$addToSet:{recent_people:msg.from}},{multi:false},(err) => {
          
        });

      }else{
        //if this message is come from a team.
        console.time('Team');
        Team.find({uid:msg.to},'member',(err,detail) => {
          LIB.check(detail[0],'Chat_Team');
          var members = detail[0].member;
          var tm = m;
          //msg.to is the uid of the team,
          tm.uid = msg.to;
          //msg.from is the person who said the message,
          tm.from_user = msg.from;
          LIB.check(tm,'messages of the team:');
          teamBroadcast(members,tm);
          Tmessage.update({uid:msg.to},{$push:{mess:tm}},(err) => {
          console.timeEnd('Team');
          });
        });
      }
    });
  });
});



const ip = '127.0.0.1';
const port = 8000;

server.listen(port,ip,function(){
  console.log(ip+':'+port);
});

function teamBroadcast(members,msgToTeam){
  members.forEach((toWhom) => {
    msgToTeam.to = toWhom;
    var J_tm = JSON.stringify(msgToTeam);
    io.emit(toWhom,J_tm);
  })
}