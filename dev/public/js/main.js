function main(username,user_info,mess,stars,tmess){
     basic(username);
function basic(username){
var userN = username;
     $('#logOff').click(function(){
          window.location.href='/logOff';
	});
	$('#person').click(function(){
          var data = {
               username:userN
          }
          formPostUrl('/people',data);
	});
	$('#myteam').click(function(){
          var data = {
               username:userN
          }
          formPostUrl('/myteam',data);
	})
	$('#buildTeam').click(function(){
          var data = {
               username:userN
          }
          formPostUrl('/buildTeam',data);
	})

     $('#starOption').click(function(){
          reset();
          $(this).css('background','transparent');
          $(this).css('color','#222');
          $('#starContent').css('display','block');
     })
     $('#teamOption').click(function(){
          reset();
          $(this).css('background','transparent');
          $(this).css('color','#222');
          $('#teamContent').css('display','block');
     })
     $('#strangeOption').click(function(){
          reset();
          $(this).css('background','transparent');
          $(this).css('color','#222');
          $('#strangeContent').css('display','block');
     })

     function reset(){
     for(var i=0;i<$('.sOption').length;i++){
          $('.sOption').eq(i).css('background','#333');
          $('.sOption').eq(i).css('background','#fff');
     }
     for(var j=0;j<$('.sContent').length;j++){
         $('.sContent').eq(j).css('display','none');
     }
}
}



















getUserInfo(username,user_info);
function getUserInfo(username,user_info){
var 
     userN = username,
     reg = /&#34;/g,
     user_info = JSON.parse(user_info.replace(reg, '\"'));

     $('#user_info').append("<div id='avator'></div><div id='intro'></div><div id='set'><span class='glyphicon glyphicon-list' aria-hidden='true'></span></div>");
     $('#avator').append('<img src='+user_info.headImg+'>');
     $('#intro').append("<div id='name'></div><div id='introduce'>"+user_info.introduce+"</div>");
     $('#name').append("<div id='nickname'>"+user_info.nickname+"</div><div id='user_name'>"+userN+"</div>");

     $('#set').click(function(){
          var domore = $('#domore');
          if(domore.__proto__.judge===undefined){
               domore.__proto__.judge = false;
          }
          if(domore.judge){
               $('#domore').css('width','0px');
          }else{
               $('#domore').css('width','60px');
          }
          domore.__proto__.judge = !domore.__proto__.judge;
     })
     $('.sContent').click(function(){
          $('#domore').css('width','0px');
          domore.__proto__.judge = false;
     })
}


















search(username);
function search(username){
var userN = username;

     $('#search-content close').click(function(){
          $('#search-id').val('');
	    $('#search-id').css('width','70%');
	    removeSearchInfo();
     });

	$('#sub').click(function(){
          removeSearchInfo();
          getResponse();
     });

    $('#search-id').keyup(function(e){
     var keyCode = e.keyCode||e.which||e.charCode;
          if(keyCode===13){
               removeSearchInfo()
               getResponse();
          }
     });


     function removeSearchInfo(){
          if($('#search-content #search-info')){
               $('#search-content #search-info').remove();
          }
     }
     function getResponse(){
          var id = $('#search-id').val().trim();
          if(!id||id===userN){
               return;
          }
          $('#search-id').css('width','60%');

          var data = {
               username:userN,
               id:id
          }
          var J_data = JSON.stringify(data);
          $.post("/search","J_data="+J_data,function(data){
               var t = data.team,p = data.person;
               $('#search-content').append("<div id='search-info'></div>");

               if(t){

          $('#search-info').append("<div id='search-team'></div>");
          $('#search-team').append("<div id='teamImg'><img src="+t.headImg+"></div><div id='tinfo'></div><div id='join'> <span class='glyphicon glyphicon-map-marker' aria-hidden='true'></span>  Join in</div>");
          $('#tinfo').append("<div id='teamname'>团队名: "+t.teamname+"</div>");
          $('#tinfo').append("<div id='builder'>ID: "+t.id+"</div>");
          $('#tinfo').append("<div id='level'>级别: "+t.level+"</div>");
          $('#tinfo').append("<div id='membernumber'>人数: "+t.membernumber+"</div>");
          $('#tinfo').append("<div id='major'>主修: "+t.major+"</div>");
          $('#tinfo').append("<div id='teamintro'>简介: "+t.introduce+"</div>");

          $('#join').click(function(){
                    var data = {
                         username:userN,
                         id:id
                    }

               var J_data = JSON.stringify(data);
               $.post('/join_judge','J_data='+J_data,function(judge){
                    if(judge==='ok'){
                         formPostUrl('/join',data);
                    }else{
                         $('#search-team').append("<li class='alert alert-info' role='alert'>已经加入过这个团队</li>");
                    }
               })
          }) 

               }else{
                    $('#search-info').append("<li  class='alert alert-warning' role='alert'>没有该团队</li>");
               }

                    if(p){

               $('#search-info').append("<div id='search-person'></div>");
               $('#search-person').append("<div id='personImg'><img src="+p.headImg+"></div><div id='pinfo'></div>");
               $('#search-person').append("<div id='send'><span class='glyphicon glyphicon-envelope' aria-hidden='true'>Mess</div><div id='star'><span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>Star</div><div id='sms'></div>");
               $('#pinfo').append("<div id='nickname'>昵称: "+p.nickname+"</div>");
               $('#pinfo').append("<div id='sex'>性别: "+p.sex+"</div>");
               $('#pinfo').append("<div id='hobby'>爱好: "+p.hobby+"</div>");
               $('#pinfo').append("<div id='personIntro'>简介: "+p.introduce+"</div>");
               $('#sms').append("<textarea></textarea>")
               $('#sms').append("<div id='tosend'>发送<span class='glyphicon glyphicon-share-alt' aria-hidden='true'></span></div>");

                         $('#send').click(function(){
                              $('#sms').css('height','120px');
                         })

                         $('#star').click(function(){
                              var data = {
                                   id:id,
                                   username:userN
                              }
                         var J_data = JSON.stringify(data);
                         $.post('/star','J_data='+J_data,function(data){
                              var judge = JSON.parse(data);
                              if(judge){
                                   $('#search-person').prepend("<li class='alert alert-success' role='alert'>成功标记该用户!</li>");

     createStarLi(userN,judge);

                              }else{
                                   $('#search-person').prepend("<li class='alert alert-success' role='alert'>已经标记该用户！</li>");
                              }
                         })

                         })

                    $('#tosend').click(function(){
                         var 
                              sms_t = $('#sms textarea'),
                              content = sms_t.val().trim();
                         var that = $('#tosend');
                         if(!content.length){
                              return false;
                         }else if(content.length>60){
                              that.css('border','solid 1px red');
                              that.text('字数不能超过6０');
                              setTimeout(function(){
                                   that.css('border','none');
                                   that.text('发送');
                              },2000)
                              return false;
                         }else{
                              var reg = /[\n"\\]/g;
                              content  = content.replace(reg,'');

                              var data = {
                                   to:id,
                                   from:userN,
                                   content:content
                              };

                              var J_data = JSON.stringify(data);
                              socket.emit('peopleChat',J_data);
                              sms_t.val('Send!');
                         }
                         setTimeout(function(){
                              sms_t.val('');
                         },1000);
                         sms_t.focus(function(){
                              sms_t.val('');
                         });
                    });
                    }else{
                         $('#search-info').append("<li  class='alert alert-danger' role='alert'>没有该用户</li>");
                    }
          })
     }
}
















getPeopleMess(username,mess,stars);
function getPeopleMess(username,mess,stars){
var 
     userN = username,
     stars = stars;

//socket for stars and strangers
socket.on(userN,function(J_msg){

var msg = JSON.parse(J_msg);
var messageframe = $('messageframe');

     //first judge the messages whether from your star;
     var isStar;
     for(var i=0;i<stars.length;i++){
          if(msg.from===stars[i]){
               isStar=true;
               break;
          }
     }


     if(isStar){
     //And judge the messageframe whether opening
          console.log('5000')
          console.log(messageframe.length);
          console.log(!messageframe.length)
          console.log(typeof !messageframe.length)

          if(!messageframe.length){
               console.log(666);
               document.getElementById('tipvoice').play();
          }

               if(messageframe.find('username').text()===msg.from){
                    var cont = messageframe.find('cont');
                    var p = document.createElement('p');
                    p.innerText = '['+ytime()+']-:'+msg.content;
                    cont.append(p);
                    cont[0].scrollTop = cont[0].scrollHeight;
               }else{
                    var star_usernames = $('#starContent').find('username');
                    for(var i=0;i<star_usernames.length;i++){
                         if(star_usernames[i].innerText===msg.from){
                              if(!$(star_usernames[i]).siblings('.badge').length){
                                   $(star_usernames[i]).after('<span class="badge">!</span>');
                              }
                         }
                    }
                    if(!$('#starOption .badge').length){
                         $('#starOption').append('<span class="badge">!</span>').click(function(){
                              $('#starOption .badge').remove();
                         });
                    }else{
                    }
               }
          
          
          //if it is a stranger
     }else{
          if(!$('#strangeOption .badge').length){
               $('#strangeOption').append('<span class="badge">!</span>').click(function(){
                    $('#strangeOption .badge').remove();
               });
          }else{
          }

          //Check if receive the strange's message before.
          var p = document.createElement('p');
          p.innerText = '['+ytime()+'] -:'+msg.content;
          var usernames = $('#strangeContent ul li username');
          var isFirstReceive = true;

          for(var i=0;i<usernames.length;i++){
               if(usernames[i].innerText===msg.from){
                    if(!$(usernames[i]).siblings('.badge').length){
                         console.log()
                         $(usernames[i]).after('<span class="badge">!</span>');
                         $(usernames[i]).parents('li').click(function(){
                              $(this).find('.badge').remove();
                         })
                    }
                    var content = $(usernames[i]).siblings('content');
                    content.append(p);
                    content[0].scrollTop=content[0].scrollHeight;

                    isFirstReceive = false;
                    break;
               }
          }

          if(isFirstReceive){

          $('#strangeContent ul').prepend('<li></li>');
          var last_li = $('#strangeContent ul').find('li').first();
          last_li.append('<username></username><close><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></close><content></content><div><input></input><sub_btn>发送<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></sub_btn></div>');
          last_li.find('username').text(msg.from);
          last_li.find('username').after('<span class="badge">!</span>');

          last_li.click(function(){
               $(this).find('.badge').remove();
               $(this).siblings().css('height','40px');
               $(this).css('height','350px')
          })

          last_li.find('close').click(function(){
               $(this).parent().remove();
               var str_username = $(this).siblings('username').text();
               var data = {
                    username:userN,
                    str_username:str_username
               }
               var J_data = JSON.stringify(data);
               $.post('/close_str_mess','J_data='+J_data);
          })

          last_li.find('content').append(p);

          last_li.find('input').keyup(function(e){
               var keyCode = e.keyCode||e.which||e.charCode;
               if(keyCode===13){
                    var mess_content  = this.value.trim();
                    var to = $(this).parent().siblings('username').text();
                    this.value = '';
                    var that = $(this);
                    strangeMessageEmit(that,mess_content,to);
               }else{
                    return false;
               }
          })
          last_li.find('sub_btn').click(function(){
               var mess_content = $(this).siblings('input').val().trim();
               var to = $(this).parent().siblings('username').text();
               $(this).siblings('input').val('');
               var that = $(this);
               strangeMessageEmit(that,mess_content,to);
          })

          }else{
               return false;
          }
     }
});












//Star and Strange message
var reg = /&#34;/g;
var mess = JSON.parse(mess.replace(reg,"\""));

//star
for(var i in mess.sta){
     var m = mess.sta[i];
     createStarLi(userN,m);
}

//stranger
for(var i in mess.str){

     var m = mess.str[i];

     $('#strangeContent ul').append('<li></li>');
     var last_li = $('#strangeContent ul').find('li').last();
     last_li.append('<username></username><close><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></close><content></content><div><input></input><sub_btn>发送<span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></sub_btn></div>');
     last_li.find('username').text(i);

     last_li.click(function(){
          $(this).find('.badge').remove();
          if(!$(this.parentNode).find('.badge').length){
               $('#strangeOption').find('.badge').remove();
          }
          $(this).siblings().css('height','40px');
          $(this).css('height','350px')
     })

     last_li.find('close').click(function(){
          $(this).parent().remove();
          var str_username = $(this).siblings('username').text();
               var data = {
                    username:userN,
                    str_username:str_username
               }
               var J_data = JSON.stringify(data);
               $.post('/close_str_mess','J_data='+J_data);
     })

     for(var j=0;j<m.length;j++){
          var p = document.createElement('p');
          p.innerText ='['+ m[j].time +']' +' -: '+m[j].content;
          last_li.find('content').append(p);
     }

last_li.find('input').keyup(function(e){
     var keyCode = e.keyCode||e.which||e.charCode;
     if(keyCode===13){
          var mess_content  = this.value.trim();
          var to = $(this).parent().siblings('username').text();
          this.value = '';
          var that = $(this);
          strangeMessageEmit(that,mess_content,to)
     }else{
          return false;
     }
})
last_li.find('sub_btn').click(function(){
     var mess_content = $(this).siblings('input').val().trim();
     var to = $(this).parent().siblings('username').text();
     $(this).siblings('input').val('');
     var that = $(this);
     strangeMessageEmit(that,mess_content,to);
})
}

function strangeMessageEmit(that,mess_content,to){
     if(!mess_content.length){
          return;
     }else{
          var p = document.createElement('p');
           p.innerText ='['+ ytime() +'] ' + 'ME: ' + mess_content;
          var content = that.parent().siblings('content');
          content.append(p);
          content[0].scrollTop = content[0].scrollHeight;
          var msg = {
               content:mess_content,
               to:to,
               from:userN
          }
          var J_msg = JSON.stringify(msg);
          socket.emit('peopleChat',J_msg);
     }
}
//stranger|

















getTeamMess(username,tmess);
function getTeamMess(username,tmess){
var 
     userN = username,
     reg = /&#34;/g;

var Tmess =  tmess.replace(reg,"\"");
var tmess = JSON.parse(Tmess);
var teamul = $('#teamContent ul');

     tmess.forEach(function(a){
     teamul.append('<li></li>');

var last_li = teamul.find('li').last();
     last_li.append('<info><div><teamname></teamname><id></id></div><introduce></introduce></info><avator><img></avator>');

     last_li.find('teamname').text(a.name);
     last_li.find('id').text(a.id);
     last_li.find('introduce').text(a.intro);
     last_li.find('avator img').attr('src',a.avator);

     socket.on('team'+a.id,function(J_msg){
          
          var msg = JSON.parse(J_msg);
          var messageframe = $('messageframe');
          if(msg.from!==userN){
               if(!messageframe.length){
               console.log(777);

                    document.getElementById('tipvoice').play();
                    teamMessageCome();
               }else{
                    if(messageframe.find('id').text()===msg.to){
                         var cont = messageframe.find('cont');
                         var p = document.createElement('p');
                         p.innerText = '['+msg.time+']'+msg.from+':'+msg.content;
                         cont.append(p);
                         cont[0].scrollTop=cont[0].scrollHeight;
                    }else{
                         teamMessageCome();
                    }
               }

               function teamMessageCome(){
                    if(!$('#teamOption .badge').length){
                         $('#teamOption').append('<span class="badge">!</span>').click(function(){
                              $(this).find('.badge').remove();
                         });
                    }
                         var team_ids = $('#teamContent').find('id');
                         for(var i=0;i<team_ids.length;i++){
                              if(team_ids[i].innerText===msg.to){
                                   $(team_ids[i]).after('<span class="badge">!</span>');
                                   $(team_ids[i]).parents('li').click(function(){
                                        $(this).find('.badge').remove();
                                        if(!$(this.parentNode).find('.badge').length){
                                             $('#teamOption').find('.badge').remove();
                                        }
                                   })
                                   break;
                              }
                         }
               }

          }
     });



          last_li.click(function(){
          //Initial team's messageframe;
          if($('messageframe')){
              $('messageframe').remove()
          }
          $("#content").append('<messageframe></messageframe>');
          var messageframe = $('messageframe');
               messageframe.append('<top><close><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></close><div><teamname></teamname><id></id></div><info><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span></info></top>');
               messageframe.append('<cont></cont>');
               messageframe.append('<say><face></face><input></input><subm><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></subm></say>');
               
               $('messageframe top div teamname').text('[Team] '+ a.name);
               
               var to = $(this).find('id').text();
               $('messageframe top div id').text(to);

               $.post("/get_team_mess","data="+to,function(data){
                    var team_messages;
                    if(typeof data==='string'){
                         team_messages = JSON.parse(data);
                    }else{
                         team_messages = data;
                    }
                    if(team_messages.length){
                    for(var i=0;i<team_messages.length;i++){
                         var p = document.createElement('p');
                         p.innerText = '['+team_messages[i].time+']'+team_messages[i].from+':\n'+team_messages[i].content;
                         $('messageframe cont').append(p);
                    }
                    }
               })

               //set function
               $('messageframe top close').click(function(){
                    $('messageframe').remove()
               });

               $('messageframe say input').keyup(function(e){

               var keyCode = e.keyCode||e.which||e.charCode;
               if(keyCode===13){
                    var mess  = $(this).val().trim();
                    this.value = '';
                    teamMessageEmit(mess);
               }
               })

          $('messageframe say subm').click(function(){
               var input = $(this).siblings('input');
               var mess = input.val();
               input.val('');
               teamMessageEmit(mess)
          })



          function teamMessageEmit(mess){
               if(!mess.length){
                    return;
               }else{
                    var messageframe = $('messageframe');
                    var cont = messageframe.find('cont');
                    var p = document.createElement('p');
                    p.innerText = '['+ytime()+'] ME:' + mess;
                    cont.append(p);
                    cont[0].scrollTop = cont[0].scrollHeight;
                    var msg = {
                         content:mess,
                         time:ytime(),
                         to:to,
                         from:userN
                    }
                    var J_msg = JSON.stringify(msg);
                    socket.emit('teamChat',J_msg);
               }
          }


          })
     })
};

}

}



















function createStarLi(userN,m){

     $('#starContent ul').append('<li></li>');
     var last_li = $('#starContent ul').find('li').last();
     last_li.append('<info><div><nickname></nickname><username></username></div><introduce></introduce></info><avator><img></avator>');
     last_li.find('nickname').text(m.nickname);
     last_li.find('username').text(m.username);
     last_li.find('introduce').text(m.introduce);
     last_li.find('avator img').attr('src',m.headImg);

     //set function
     last_li.click(function(){
          $(this).find('.badge').remove();
          if(!$(this.parentNode).find('.badge').length){
               $('#starOption').find('.badge').remove();
          }
     //Initial star's messageframe
     if($('messageframe')){
          $('messageframe').remove();
     } 
     $('#content').append('<messageframe></messageframe>');
     $('messageframe').append('<top></top><cont></cont><say></say>');
     $('messageframe top').append('<close><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></close><div><nickname></nickname><username></username></div><info><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span></info>');
     $('messageframe say').append('<face></face><input></input><subm><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></subm>');
          
     $('messageframe top div nickname').text($(this).find('nickname').text());
     $('messageframe top div username').text($(this).find('username').text());

          var star_username = $(this).find('username').text();
          var data = {
               username:userN,
               star_username:star_username
          }
          var J_data = JSON.stringify(data);
          $.post("/get_star_mess",'J_data='+J_data,function(Data){
               Data.forEach(function(a){
                    var p = document.createElement('p');
                    p.innerText = '['+a.body.time+'] -:' + a.body.content;
                    var cont = $('messageframe cont');
                    cont.append(p);
                    cont[0].scrollTop = cont[0].scrollHeight;
               })
          })

          //set function
          $('messageframe close').click(function(){
               $('messageframe').remove();
          })

          $('messageframe input').keyup(function(e){
               var keyCode = e.keyCode||e.which||e.charCode;
               if(keyCode===13){
                    starMessageEmit(userN);
               }else{
                    return false;
               }
          })

     $('messageframe subm').click(function(){
          starMessageEmit(userN)
     });

     })
}









function starMessageEmit(userN){
     var 
          messageframe = $('messageframe'),
          cont = messageframe.find('cont'),
          to = messageframe.find('username').text(),
          mess_content = messageframe.find('input').val();
          if(!mess_content.length){
               return;
          }else{
                var msg = {
                    content:mess_content,
                    to:to,
                    from:userN
               }
               var J_msg = JSON.stringify(msg);
               socket.emit('peopleChat',J_msg);
               var p = document.createElement('p');
               p.innerText = '['+ytime()+'] ME:' + mess_content;
               cont.append(p);
               cont.scrollTop(cont[0].scrollHeight);
               messageframe.find('input').val('');
          }
}