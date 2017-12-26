var uid = document.getElementById('getuid').value;
console.log('uid:'+uid);


var people = new Vue({
     el:'.container',
     data:{ uid:uid },
     methods:{
          showPeopleHeadForm:function(){
		   document.getElementById('peopleHeadForm').style.display = 'block';
          },
          backToMainPage:function(){
               formPost('/main',{uid:uid});
          },
          headUpdate:function(){
               var avator = $('#avator').val();
               if(avator.length){
                    $('#peopleHeadForm').submit();
               }else{
                    $('#avator').css('border','solid 1px #449933');
               }
          },
          textUpdate:function(){
               var 
                    name = $('#name').val().trim(),
                    introduce = $('#introduce').val().trim(),
                    sex = $('#sex').val().trim(),
                    hobby = $('#hobby').val().trim(),
                    birthday = $('#birthday').val().trim();

               if(name.length>10){
                    $('#name').css('border','solid 1px red');
                    $('button#textUpdate').text('昵称字数过长');
                    setTimeout(function(){
                         $('button#textUpdate').text('更新');
                    },2000);
               }else if(introduce.length>60){
                    $('textarea#introduce').css('border','solid 1px red');
                    $('button#textUpdate').text('简介字数不能超过6０');
                    setTimeout(function(){ $('button#textUpdate').text('更新'); },2000);
               }else{
                    var data = {
                         uid:uid,
                         name:name,
                         introduce:introduce,
                         sex:sex,
                         hobby:hobby,
                         birthday:birthday
                    };
                    text_filter(data);
                    postChangeText('/peopleT',data,function(data_back){
                         $('#name').val(data_back.name);
                         $('#introduce').val(data_back.introduce);
                         $('#sex').val(data_back.sex);
                         $('#hobby').val(data_back.hobby);
                         $('#birthday').val(data_back.birthday);
                         $('button#textUpdate').text('更新成功');
                         setTimeout(function(){ $('button#textUpdate').text('更新'); },2000);
                    });
               } 
          },
          showImg:function(e){
               var that = e.target;
               var img = that.nextElementSibling;
               var r = new FileReader();
               r.readAsDataURL(that.files[0]);
               r.onload = function(e){
                    img.src=this.result;
               };
          }
     }
});