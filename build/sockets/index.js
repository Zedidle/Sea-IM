const {
  User,
  People,
  Pmess,
  Tmess,
  Team,
  List,
  Unread,
  redis,
} = require('../../configs/server.config.js');


module.exports = function(server){

	var io = require('socket.io')(server);

  io.on('connection', function(socket){

    console.log('Socket is on ready!');


    socket.on('heartbeat',(uid)=>{
      redis.set(uid,true,()=>{
        setTimeout(()=>{
          redis.set(uid,false,()=>{
            console.log(uid,'bit')
          });
        },4950)
      })
    });




  socket.on('chat', function(J_msg) {
    //1.服务器接收格式化了的消息，并解格式化；
    var msg = JSON.parse(J_msg);
    console.log(msg);

    People.findOne({uid:msg.from},(err, p) => {
      // 2.获取来信者信息，并把来信者信息和接收到的消息组合起来，成为数据库设计中的消息结构体；
      let m = {
          uid:msg.from,
          type:msg.type,
          to:msg.to,
          time:msg.time,
          content:msg.content,
      };
      if(p){
        m.headImg = p.headImg,
        m.name = p.name,
        m.introduce = p.introduce
      }

      J_m = JSON.stringify(m);
      // 3.判断消息来自于团队还是个人，从而进入不同的处理分支；
      if(msg.type==='p'){
        // 1.如果来自于个人，则判断接收者是否在线，在线则直接把消息结构体发送给接收者，否则使得接收者对应未读消息+1；
        User.findOne({uid:m.to},(err,d)=>{
          console.log(d)
          if(d.login){
            //在线
            console.log(d.uid + ' on');
            io.emit(msg.to,J_m);
          }else{
            //不在线
            Unread.findOne({uid:msg.to}, (err,d) => {

              var punr = d.punr;
              //如果没有创建过对应的未读数量值，则新建为1
              punr[msg.from] = punr[msg.from]?punr[msg.from]+1:1;

              Unread.update({uid:msg.to}, { $set:{ punr } } ).exec();
            })
          }
        })

        // 2.给发送者转回格式化的消息结构体；
        io.emit(msg.from,J_m);

        //add the message to the receiver and sender.
        // 3.更新通讯双方对应的消息记录；
        // 4.如果之前都没建立过通讯的话，则双方登记对方
        Pmess.findOne({uid:msg.to}, (err, receiverM) => {
          let mess = receiverM.mess;
          // 登记
          if(!mess[msg.from]){ mess[msg.from]=[]; }
          mess[msg.from].push(m);
          Pmess.update({uid:msg.to}, {$set:{mess}}).exec();
        });

        Pmess.findOne({uid:msg.from}, (err, senderM) => {
          let mess = senderM.mess;
          //登记
          if(!mess[msg.to]){ mess[msg.to]=[]; }
          mess[msg.to].push(m);
          Pmess.update({uid:msg.from}, {$set:{mess}}).exec();
        });

        //make loginlist.recent_people of msg.from addToSet msg.to,
        //the third argument of update is used to decide whether update all contents that is meeting the condition,
         // 4.更新接收方最近联系人；
        List.update({uid: msg.from},{ $addToSet:{ recent_people: msg.to } } ).exec();

        //make loginlist.recent_people of msg.to addToSet msg.from,
        List.update({uid: msg.to}, { $addToSet:{ recent_people: msg.from }} ).exec();

      }else if(msg.type==='t'){
        // if this message is come from a team.
        // 1.如果来自于团队，则读取团队中的成员列表；
        
        Team.findOne({uid:msg.to}, (err,t) => {
          var members = t.member;
          var tm = m;
          // change owner of msg as 'uid' and save the sender as 'from'
          tm.uid = msg.to;
          tm.from = msg.from;
          // 2.遍历成员列表并把消息结构体发送给每个成员；
          teamBroadcast(members,tm);
          function teamBroadcast(members, msgToTeam) {
            members.forEach((toWhom) => {
              console.log('to:',toWhom);
              msgToTeam.to = toWhom;
              var J_tm = JSON.stringify(msgToTeam);
              io.emit(toWhom,J_tm);
            });
          }
           // 3.更新团队的消息记录；
          Tmess.update({uid:msg.to}, {$push:{mess:tm}}).exec();
        });
      }

    });
  });
});
};