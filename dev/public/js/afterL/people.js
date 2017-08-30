function people(username){
var doc = document;
	doc.getElementById('headImg').onclick = function(){
		doc.getElementById('peopleHeadForm').style.display = 'block';
	}
	doc.getElementById('back').onclick = function(){
		var data = {
			username:username
		}
		formPostUrl('/main',data);
	}

$('#headUpdate').click(function(){
     var avator = $('#avator').val();
     if(avator.length){
     var input = doc.createElement('input');
          input.style.display = 'none';
          input.name = 'username';
          input.value = username;

     var peopleHeadForm = $('#peopleHeadForm');
          peopleHeadForm.append(input);
          peopleHeadForm.submit();
     }else{
          $('#avator').css('border','solid 1px #449933');
          return false;
     }
});

$('#textUpdate').click(function(){
     var 
          nickname = $('#nickname').val().trim(),
          introduce = $('#introduce').val().trim(),
          sex = $('#sex').val().trim(),
          hobby = $('#hobby').val().trim(),
          birthday = $('#birthday').val().trim();

if(nickname.length>10){
     $('#nickname').css('border','solid 1px red');
     $('button#textUpdate').text('昵称字数过长');
     setTimeout(function(){
          $('button#textUpdate').text('更新');

     },2000)
     return false;
}else if(introduce.length>60){
     $('textarea#introduce').css('border','solid 1px red');
     $('button#textUpdate').text('简介字数不能超过6０');
     setTimeout(function(){
          $('button#textUpdate').text('更新');

     },2000)
     return false;
}else{
     var data = {
          username:username,
          nickname:nickname,
          introduce:introduce,
          sex:sex,
          hobby:hobby,
          birthday:birthday
     }
     filter(data);
     postChangeText('/peopleT',data,textUpdate);
}

function filter(data){
     if(typeof data === 'object'){
          var reg = /[\n"\\]/g;
          for(para in data){
               data[para] = data[para].replace(reg,'');
          }
     }
};
     function textUpdate(data){
          $('#nickname').val(data.nickname);
          $('#introduce').val(data.introduce);
          $('#sex').val(data.sex);
          $('#hobby').val(data.hobby);
          $('#birthday').val(data.birthday);
     }
})

}
