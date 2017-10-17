function getTime(){
  var time = new Date();
  return time.getHours()+':'+time.getMinutes();
}
function getDayTime(){
  var time = new Date();
  var month = parseInt(time.getMonth())+1;
  return month+ '.' +time.getDate()+'  '+time.getHours()+':'+time.getMinutes();
}
function issame(v1,v2){
  return (v1===v2)?true:false;
}

function text_filter(data){
  if(typeof data === 'object'){
    var reg = /[\n"\\]/g;
    for(para in data){
      // data[para] = data[para].replace(reg,'');
      console.log(data[para])
    }

  }else{
    console.log('No Object')
  }
};

var data = {
  n:1,
  b:2
}

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
      console.log(input)
      form.appendChild(input);
    }
  }else{
    console.log('Not paraments');
  }
  document.querySelector('body').appendChild(form);
  form.submit();
}

function postChange(url,data,callback){
  var J_data = JSON.stringify(data);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST',url,true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send('J_data='+J_data);
  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState===4&&xmlhttp.status===200){
      var data = JSON.parse(xmlhttp.responseText);
      callback(data);
    }
  }
}

// 'multipart/form-data'


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
                    callback(data);
               }
          }
}


function ytime(){
     var time = new Date();
     var month = parseInt(time.getMonth())+1;
     time = time.getFullYear()+'.'+month+ '.' +time.getDate()+'   '+time.getHours()+':'+time.getMinutes();
     return time;
}