<h1>Sea Net</h1>
http://39.108.154.125
<p>ACCOUNTS:z00000,z00001,z00002,z00005,z00006,z00007,z00008,z00009</p>
<p>PASSWORD:123456789</p>
<p>You also register your own account.</p>

<br>

<h3>Download</h3>
git clone https://github.com/DoubleCG/seanet.git

<h4>TEST</h4>
<pre>cd seanet
npm install
npm run sup
</pre>

<br>
<h2>Technical Stack</h2>
<p>Vue2.0：build the front page.</p>
<p>Socket.io：transport messages in true time.</p>
<p>Express</p>
<p>Client use ES5, Server use ES6，promise deal with async program.</p>
<p>localStorage：Save the user's information locally.</p>
<p>Gulp: model package</p>
<p>LESS:</p>
<p>CSS3:stylesheet</p>
<p>Mongodb</p>
<p>jsonp：跨域请求数据</p>
<p>pm2: 服务端使用pm2部署，常驻进程 </p>
<p>nginx：服务端使用nginx代理端口转发</p>


<h3>Segments of the server code: </h3>
<h4>Socket.io</h4>
Sercer (Express): seanet/dev/app.js
<pre>
const fs = require('fs');
const express = require('express');
const app = express();
const LIB = require('./routes/lib.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes/routes')(app);
const path = require('path');
const mongoose=require('mongoose');
const User = require('../model/user');
const Unread = require('../model/unread');
const Message = require('../model/message');
const Tmessage = require('../model/tmessage');
const People = require('../model/people');
const Team = require('../model/team');
const Loginlist = require('../model/loginlist');

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

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
    res.render('404.ejs', {})
});


io.on('connection', function(socket){
  socket.on('heartbeat',function(uid){
    User.update({uid},{$set:{login:true}},err=>{ console.log(uid + ' login'); });
    setTimeout(function(){
      User.update({uid},{$set:{login:false}},err=>{ console.log(uid + ' logout'); });
    },19000);
  });


  socket.on('chat',function(J_msg){

    var msg = JSON.parse(J_msg);
    LIB.check(msg,'chat the message:');
    LIB.check(msg.content,'the content of message:');


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

        User.find({uid:msg.to}, null, { limit: 1 }, (err,detail)=>{
          LIB.check(detail[0],'To:');
          if(detail[0].login){
            io.emit(msg.to,J_m);
          }else{
            Unread.find({uid:msg.to},'punRead',{limit:1},(err,detail)=>{
              var punRead = detail[0].punRead;
              if(!punRead[msg.from]){ punRead[msg.from] = 0; }
              punRead[msg.from] = punRead[msg.from] + 1;
              Unread.update({uid:msg.to},{$set:{punRead}},(err)=>{});
            })
          }
        })

        io.emit(msg.from,J_m);

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

        Loginlist.update({uid:msg.from},{$addToSet:{recent_people:msg.to}},{multi:false},(err)=>{});
        Loginlist.update({uid:msg.to},{$addToSet:{recent_people:msg.from}},{multi:false},(err)=>{});

      }else{
        Team.find({uid:msg.to},'member',(err,detail)=>{
          LIB.check(detail[0],'Chat_Team');
          var members = detail[0].member;
          var tm = m;
          tm.uid = msg.to;
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
</pre>


<br>
Client: seanet/dev/js/main.js
<pre>
    sendMessage:function(){
      var v = $('#messageframe_input').val().trim();
      if(v.length){
        var msg = {
          time:getTime(),
          type:this.messtype,
          content:v,
          to:this.messto,
          from:uid
        }
        var J_msg = JSON.stringify(msg);
        socket.emit('chat',J_msg);
      }
    },

socket.on(uid,function(J_msg){ 
  main.messageCome(JSON.parse(J_msg)); 
});

setInterval(function(){
  socket.emit('heartbeat',uid); 
},10000);
</pre>

<br>

socket.io最核心的两个api就是`emit` 和 `on`了 ，服务端和客户端都有这两个api。通过 `emit` 和 `on`可以实现服务器与客户端之间的双向通信。

`emit` ：发射一个事件，第一个参数为事件名，第二个参数为要发送的数据，第三个参数为回调函数（如需对方接受到信息后立即得到确认时，则需要用到回调函数）。

`on` ：监听一个 emit 发射的事件，第一个参数为要监听的事件名，第二个参数为回调函数，用来接收对方发来的数据，该函数的第一个参数为接收的数据。

服务端常用API：

`socket.emit()`：向建立该连接的客户端发送消息

`socket.on()`：监听客户端发送信息

`io.to(socketid).emit()`：向指定客户端发送消息

`io.sockets.socket(socketid).emit()`：向指定客户端发送消息，新版本用`io.sockets.socket[socketid].emit()` ，数组访问

`socket.broadcast.emit()`：向除去建立该连接的客户端的所有客户端广播

`io.sockets.emit()`：向所有客户端广播

客户端常用API：

`socket.emit()`：向服务端发送消息

`socket.on()`：监听服务端发来的信息




<h3>Database Design</h3>

<h4>When user login successfully, load the chatting lists base on the schema.</h4>
<pre>
var loginlistSchema = new Schema({
    uid:String,
    recent_people:Array,
    recent_team:Array,
    star:Array,
    team:Array,
})
</pre>
<h4>The record of messages of user, base on the schema.</h4>
<pre>
var messageSchema = new Schema({
    uid:String,
    mess:Object,
    // The argument mess save data like this: 
    // "mess" : {
    //     "0" : "0",
    //     "userId" : [
    //         {
    //             "uid" : String,
    //             "to" : String,
    //             "type" : String,
    //             "headImg" : String,
    //             "name" : String,
    //             "time" : String,
    //             "content" : String,
    //             "introduce" : String,
    //         },
    //         ...
    //     ],
    //     ...
    // },
})
</pre>
<h3>More design of database base on the Mongoose is in file "seanet/model".</h3>