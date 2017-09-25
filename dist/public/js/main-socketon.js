//   socket.on(uid,function(J_msg){
//     var msg = JSON.parse(J_msg);
//     var messageframe = $('messageframe');
//     if(msg.from!==userN){
//       if(!messageframe.length){
//         document.getElementById('tipvoice').play();
//         teamMessageCome();
//       }else{
//         if(messageframe.find('id').text()===msg.to){
//           var 
//             cont = messageframe.find('cont'),
//             p = document.createElement('p');
//           p.innerText = '['+msg.time+']'+msg.from+':\n\t'+msg.content;
//           cont.append(p);
//           cont[0].scrollTop=cont[0].scrollHeight;
//         }else{
//           teamMessageCome();
//         }
//       }
//     }
//   });

// //socket for stars and strangers
// socket.on(userN,function(J_msg){
// var 
//   msg = JSON.parse(J_msg),
//   messageframe = $('messageframe');
// //first judge the messages whether from your star;
// var isStar;
// for(var i=0;i<stars.length;i++){
//   if(msg.from===stars[i]){
//     isStar=true; break;
//   }
// }
// if(isStar){
// //And judge the messageframe whether opening
//   if(!messageframe.length){
//     document.getElementById('tipvoice').play();
//   }
//   if(messageframe.find('username').text()===msg.from){
//     contentAddMess()
//   }else{
//     addMessageComeTips()
//   }
// }else{
//   strangerMessTip();
//   receiveStrangerMess();
// }
// });