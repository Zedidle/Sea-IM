<h1>Sea Net</h1>

<h3>Web site: 39.108.154.125</h3>
<h3>Accounts for test:z00000,z00001,...z00009 ; password: '123456789';</h3>

<br>

<h3>Download:</h3>
git clone https://github.com/DoubleCG/seanet.git

<h3>Test or start the system</h3>
<pre> 
cd seanet/dist
supervisor app
</pre>

<h3>Stack of technique:</h3>
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

<h2>The function of files: </h2>

<h3>seanet/dev/app.js</h2>
<h4>1. the transport to receive and send all messages</h4>
<h4>2. the begining enter of the system. In the file "seanet/dist" , you can execute the command like "supervisor app" to start the system.</h3>

<br>

<h3>seanet/dev/clearlogin.js (just for developer) : set login's status of all users to logout</h3>
<h3>seanet/dev/ini.js (just for developer): initial all data in DB, and set new data for test.
Create the account z00000,z00001...z00009, the password is all '123456789'.
</h3>

<br>
<h2>seanet/gulpfile.js</h2>
<h3>In the file "seanet", execute command "gulp" , it will create a file "dist" base on file "dev". File "dist" is the normal file should be executed.</h3>
<pre>
    cd seanet/dist
    pm2 start app.js    
</pre>


<h3>Segments of the Server code: </h3>
<h3><b> Socket.io </b></h3>
服务端(Express):

<h3>javascript</h3>
// Server (seanet/dev/app.js)
<pre>

const server = require('http').Server(app);
const io = require('socket.io')(server);


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
</pre>
客户端：

```javascript
// Client
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<script>
  const socket = io.connect('http://localhost:3000')
  socket.on('news', (data)=>{
    socket.emit('my other event', { my: 'data' })
  })
</script>

<pre>
// seanet/dev/views/main.ejs
<script src="/socket.io/socket.io.js"></script>
<script>var socket = io();</script>
<script src='js/main.js'></script>



// seanet/dev/js/main.js

//when user send any message, run this function,
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

//listen the port of the user,
socket.on(uid,function(J_msg){ 
  main.messageCome(JSON.parse(J_msg)); 
});

//every 10 seconds to send a heartbeat package , keep on line;
setInterval(function(){
  socket.emit('heartbeat',uid); 
},10000);
</pre>

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


## FAQ

若使用的过程中遇到问题，可以加官方群交流：611212696。

如果觉得不错，就毫不吝啬地给个star吧。后期项目还会继续更新和完善。


















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