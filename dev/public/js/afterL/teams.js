function formPostUrl(url,object){
     var form = document.createElement('form');
     form.action = url;
     form.method = 'post';
     form.target = "_self";
     form.style.display = "none";
     if(typeof object==='object'){
          for(var para in object){
               var input = document.createElement('input');
               input.name = para;
               input.value = object[para];
               form.appendChild(input);
          }
     }else{
          console.log('Not paraments');
     }
     document.querySelector('body').appendChild(form);
     form.submit();
}



function teamRender(username){
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
}

function postChangeImg(url,data,callback){
     var J_data = JSON.stringify(data);
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open('POST',url,true);
          xmlhttp.setRequestHeader("Content-type",'multipart/form-data');
          xmlhttp.send('J_data='+J_data);
          xmlhttp.onreadystatechange = function(){
               if(xmlhttp.readyState===4&&xmlhttp.status===200){
                    var data = JSON.parse(xmlhttp.responseText);
                    callback(data);
               }
          }
}

function postChangeText(url,data,callback){
     var J_data = JSON.stringify(data);
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open('POST',url,true);
          xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          xmlhttp.send('J_data='+J_data);
          xmlhttp.onreadystatechange = function(){
               if(xmlhttp.readyState===4&&xmlhttp.status===200){

                    var data = JSON.parse(xmlhttp.responseText);
                    console.log(data);
                    callback(data);
               }
          }
}

function updateInitial(username){

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
