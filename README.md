<h1>Sea Net</h1>
Website: 39.108.154.125
<p>Accounts:z00000,z00001,z00002,...z00009 ; password: '123456789';</p>

<br>

<h3>Download</h3>
git clone https://github.com/DoubleCG/seanet.git

<h4>TEST</h4>
<pre> cd seanet/dist
supervisor app
</pre>

<br>
<h3><b>technical stack</b></h3>
<h4>Vue2.0：build the front page.</h4>
<h4>Socket.io：transport messages in true time.</h4>
<h4>Express</h4>
<h4>Client use ES5, Server use ES6，promise deal with async program.</h4>
<h4>localStorage：Save the user's information locally.</h4>
<h4>Gulp: model package</h4>
<h4>LESS</h4>
<h4>CSS3:stylesheet</h4>
<h4>Mongodb</h4>
<h4>jsonp：跨域请求数据</h4>
<h4>pm2: 服务端使用pm2部署，常驻进程 </h4>
<h4>nginx：服务端使用nginx代理端口转发</h4>



<br>

<h2>The Models's Function</h2>

<h3>seanet/dev/app.js</h2>
<p>1. the transport to receive and send all messages</p>
<p>2. the begining enter of the system. In the file "seanet/dist" , you can execute the command like "supervisor app" to start the system.</p>

<br>

<h3>seanet/dev/clearlogin.js (developer)</h3>
set login's status of all users to logout
<h3>seanet/dev/ini.js (developer)</h3>
initial data in database, and set new data for test.
Create the account z00000,z00001...z00009, the password is all '123456789'.

<br>
<h3>seanet/gulpfile.js</h3>
<p>In the file "seanet", execute command "gulp" , it will create a file "dist" base on file "dev". File "dist" is the normal file should be executed.</p>
<pre>
cd seanet/dist
pm2 start app.js    
</pre>

<br>

<h3>Segments of the server code: </h3>
<h4>Socket.io</h4>
服务端(Express):
<h4>javascript</h4>
Server (seanet/dev/app.js)
<pre>
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){

    socket.on('heartbeat',function(uid){
        User.update({uid},{$set:{login:true}},err=>{});
        setTimeout(function(){
            User.update({uid},{$set:{login:false}},err=>{});
        },19000);
    });

    socket.on('chat',function(J_msg){
        var msg = JSON.parse(J_msg);
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
            User.find({uid:msg.to}, 'login', { limit: 1 }, (err,detail)=>{
                if(detail[0].login){
                    io.emit(msg.to,J_m);
                }else{
                    Unread.find({uid:msg.to},'punRead',{limit:1},(err,detail)=>{
                        var punRead = detail[0].punRead;
                        if(!punRead[msg.from]){ 
                            punRead[msg.from] = 0; 
                        }
                        punRead[msg.from] = punRead[msg.from] + 1;
                        Unread.update({uid:msg.to},{$set:{punRead}},(err)=>{
                        });
                    })
                }
            })

            io.emit(msg.from,J_m);

            Message.find({uid:msg.to},null,{limit:1},(err,detail)=>{
                let mess = detail[0].mess;
                if(!mess[msg.from]){ 
                    mess[msg.from]=[]; 
                }
                mess[msg.from].push(m);
                Message.update({uid:msg.to},{$set:{mess}},(err)=>{})
            })
            Message.find({uid:msg.from},null,{limit:1},(err,detail)=>{
                let mess = detail[0].mess;
                if(!mess[msg.to]){ 
                    mess[msg.to]=[]; 
                }
                mess[msg.to].push(m);
                Message.update({uid:msg.from},{$set:{mess}},(err)=>{})
            });

            Loginlist.update({uid:msg.from},{$addToSet:{recent_people:msg.to}},{multi:false},(err)=>{});
            Loginlist.update({uid:msg.to},{$addToSet:{recent_people:msg.from}},{multi:false},(err)=>{});
        
        }else{
            Team.find({uid:msg.to},'member',(err,detail)=>{
                var members = detail[0].member;
                var tm = m;
                tm.uid = msg.to;
                tm.from_user = msg.from;
                teamBroadcast(members,tm);
                Tmessage.update({uid:msg.to},{$push:{mess:tm}},(err)=>{});
            })
        }
    });
  });
});
</pre>
客户端：
<p>javascript</p>
seanet/dev/views/main.ejs
<pre>
<script src="/socket.io/socket.io.js"></script>
<script>var socket = io();</script>
<script src='js/main.js'></script>
</pre>
<br>
seanet/dev/js/main.js
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







<h3>Database design</h3>

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
<h3>More design of database base on the Mongoose is in file "seanet/dev/mongoModel".</h3>

<br>

<h3>seanet/dev/public : all the public file are saved in this file</h3>
<h4>cropper : precently it is useless</h4>
<h4>img : save all the important default images</h4>
<h4>js : save all the important javascript function</h4>
<h4>less : all stylesheet are saved in this file</h4>
<h4>voice : all voice are saved in this file</h4>

<br>

<h3>seanet/dev/routes : the part of back end</h3>
<h4>back.js : just turn back to the chatting page and reload.</h4>
<h4>lib.js : my function library.</h4>
<h4>message.js : deal with the unread message to get.</h4>
<h4>people.js : the person information model.</h4>
<h4>routes.js : the transport of routes to link with the app.js.</h4>
<h4>search.js : the model of the search functions in main page.(search person or team information,star someone,join a team...)</h4>
<h4>start.js : the begining of system: login/register/main</h4>
<h4>team.js : the team information model.</h4>
<h4>unreadnumber.js : deal with the messages and load the information of person or team.</h4>

<br>

<h3>seanet/dev/views : (the part of front end)all page's templates are saved in this file</h3>
<h4>buildteam.ejs : template of the model for user to build a team.</h4>
<h4>dismissTeam.ejs : template of the model for team's owner to dismiss a team.</h4>
<h4>join.ejs : template of the model for a user to join a team.</h4>
<h4>login.ejs : template of the model for a user to login.</h4>
<h4>main.ejs : template of the model for a user login,when the user login successfully, show him the main chatting page.</h4>
<h4>myteam.ejs : template of the model for a user to check the teams that he has joined in.</h4>
<h4>people.ejs : template of the model for a user to check and modify his information to show.</h4>
<h4>regist.ejs : template of the model for a stranger to register his account.</h4>
<h4>registinfo.ejs : template of the model for a stranger register successfully,give the new user a tip to skip to the login page.</h4>
<h4>successB.ejs : template of the model for a user build a team successfully,give the user a tip to skip to the main chatting page.</h4>
<h4>success_dismissTeam.ejs : template of the model for a user dismiss a team successfully,git the user a tip to build a new immediately or go back to the main chatting page.</h4>
<h4>teams.ejs : template of the model for a user to check and modify the information of the team.</h4>
<h4>tipDealWithTeam.ejs : template of the model for a user to rebuild a team, give the user a tip to dismiss the initial team or cancal.</h4>