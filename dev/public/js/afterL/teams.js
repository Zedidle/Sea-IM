function teams(username){
	var doc = document;
	doc.getElementById('headImg').onclick = function(){
		doc.getElementById('teamHeadForm').style.display = 'block';
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
     var input = document.createElement('input');
          input.style.display = 'none';
          input.name = 'id';
          input.value = username;
     var teamHeadForm = $('#teamHeadForm');
          teamHeadForm.append(input);
          teamHeadForm.submit();
    }else{
     $('#avator').css('border','solid 1px #449933');
     return false;
    }
});

$('#textUpdate').click(function(){
     var 
          teamname = $('#teamname').val().trim(),
          major = $('#major').val().trim(),
          introduce = $('#introduce').val().trim();

     if(introduce.length>80){
          $('textarea#introduce').css('border','solid 1px red');
          $('button#textUpdate').text('简介字数不能超过８０');
          setTimeout(function(){
               $('button#textUpdate').text('更新');

          },2000)
          return false;
     }else{
          var data = {
               id:username,
               teamname:teamname,
               major:major,
               introduce:introduce
          }
     filter(data);
     postChangeText('/teamsT',data,textUpdate);
}


function filter(data){
     if(typeof data === 'object'){
          var reg = /[\n"\\]/g;
          for(para in data){
               data[para] = data[para].replace(reg,'');
               console.log(data[para]);
          }
     }else{
          console.log('No Object')
     }
};

function textUpdate(data){
     $('#teamname').val(data.teamname);
     $('#major').val(data.major);
     $('#introduce').val(data.introduce);
}
     
});


}