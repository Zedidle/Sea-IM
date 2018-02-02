module.exports = function(server){

	var io = require('socket.io')(server);

  console.log('√---服务器开启socket通讯---√');
  console.log("开始监听|心跳包|聊天消息|");
  
  io.on('connection', function(socket){

    socket.on('heartbeat',function(uid){
      User.update({uid}, {$set:{login:true}}, (err) => { 
        if(err) throw err;
        console.log(uid + ' login');
      });
      setTimeout(function(){
        User.update({uid}, {$set:{login:false}}, (err) => { 
          if(err) throw err;

          console.log(uid + ' logout'); 
        });
      },19000);
    });

  socket.on('chat', function(J_msg) {
    //1.服务器接收格式化了的消息，并解格式化；
    var msg = JSON.parse(J_msg);
    console.time(1);
    console.log(msg);

    People.find({uid:msg.from}, null, {limit:1}, (err, pinfo) => {
      if(err) throw err;
      var p = pinfo[0];
      // 2.获取来信者信息，并把来信者信息和接收到的消息组合起来，成为数据库设计中的消息结构体；
      var m = {
        uid:msg.from,
        to:msg.to,
        type:msg.type,
        headImg:p.headImg,
        name:p.name,
        time:msg.time,
        content:msg.content,
        introduce:p.introduce
      };

      LIB.check(m,'Consistent message');

      J_m = JSON.stringify(m);
      console.timeEnd(1);
      // 3.判断消息来自于团队还是个人，从而进入不同的处理分支；
      if(msg.type!=='team'){
        // 1.如果来自于个人，则判断接收者是否在线，在线则直接把消息结构体发送给接收者，否则使得接收者对应未读消息+1；
        User.find({uid:msg.to}, null, {limit: 1}, (err,detail) => {
          if(err) throw err;

          if(detail[0].login){
            io.emit(msg.to,J_m);
          }else{
            Unread.find({uid:msg.to}, 'punRead', {limit:1}, (err,detail) => {
              if(err) throw err;

              var punRead = detail[0].punRead;
              if(!punRead[msg.from]){
                punRead[msg.from] = 0;
              }
              
              punRead[msg.from]++;

              Unread.update(
                {
                  uid:msg.to
                },
                {
                  $set:{
                    punRead
                  }
                }, 
                function(err){
                  if(err) throw err;
                });
            })
          }
        })

        // 2.给发送者转回格式化的消息结构体；
        io.emit(msg.from,J_m);

        //add the message to the receiver and sender.
        // 3.更新通讯双方对应的消息记录；
        // 4.如果之前都没建立过通讯的话，则双方登记对方
        Message.find({uid:msg.to}, null, {limit:1}, (err, reveiver_mess) => {
          if(err) throw err;

          let mess = reveiver_mess[0].mess;

          console.log('reveiver:'+ mess);


          if(!mess[msg.from]){ 
            mess[msg.from]=[];
          }
          mess[msg.from].push(m);
          Message.update({uid:msg.to}, {$set:{mess}}, (err) => {
            if(err) throw err;
            console.log('reveiver update message;')
          });
        });

        Message.find({uid:msg.from}, null, {limit:1}, (err, sender_mess) => {
          if(err) throw err;
        
          let mess = sender_mess[0].mess;

          console.log('sender:'+mess);


          if(!mess[msg.to]){
            mess[msg.to]=[];
          }
          mess[msg.to].push(m);
          Message.update({uid:msg.from}, {$set:{mess}}, (err) => {
            if(err) throw err;
            console.log('sender update message;')
          });
        });

        //make loginlist.recent_people of msg.from addToSet msg.to,
        //the third argument of update is used to decide whether update all contents that is meeting the condition,
         // 4.更新接收方最近联系信息；
        Loginlist.update(
          {
            uid: msg.from
          },
          {
            $addToSet:{
              recent_people: msg.to
            }
          },
          {
            multi:false
          },
          function(err){
            if(err) throw err;
          }
        );

        //make loginlist.recent_people of msg.to addToSet msg.from,
        Loginlist.update(
          {
            uid: msg.to
          },
          {
            $addToSet:{
              recent_people: msg.from
            }
          },
          {
            multi:false
          },
          function(err){
            if(err) throw err;
          }
        );

      }else{
        // if this message is come from a team.
        // 1.如果来自于团队，则读取团队中的成员列表；
        console.time('Team');
        
        Team.find({uid:msg.to}, 'member', (err,detail) => {
          var members = detail[0].member;
          var tm = m;
          tm.uid = msg.to;
          tm.from_user = msg.from;
          // 2.遍历成员列表并把消息结构体发送给每个成员；
          teamBroadcast(members,tm);
          function teamBroadcast(members, msgToTeam) {
            members.forEach((toWhom) => {
              msgToTeam.to = toWhom;
              var J_tm = JSON.stringify(msgToTeam);
              io.emit(toWhom,J_tm);
            });
          }
           // 3.更新团队的消息记录；
          Tmessage.update({uid:msg.to}, {$push:{mess:tm}}, (err) => {
            console.timeEnd('Team');
          });
        });
      }
    });
  });
});

};