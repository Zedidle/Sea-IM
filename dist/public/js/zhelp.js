Array.prototype.pull = function(o){
  for(var i = 0; i<this.length; i++){
    if(this[i] === o){
      this.splice(i,1);
    }
  }
  return this;
};
function check(object,n){
  console.log('');
  console.log('Check:'+n||'');
  console.log('Content:'+object);
  console.log('   Type:'+ typeof object);
  if(Array.isArray(object)){
    console.log('It is array,length is '+object.length);
  }
  if(typeof(object) === 'string'){
    console.log(' Length:' + object.length);
  }
  console.log('');
}
function yTime(){
  var time = new Date();
  var month = time.getMonth()+1;
  time = time.getFullYear()+'-'+month+ '-' +time.getDate()+'   '+time.getHours()+':'+time.getMinutes();
  return time;
}
function mTime(){
  var time = new Date();
  var month = parseInt(time.getMonth())+1;
  return month+ '.' +time.getDate()+'  '+time.getHours()+':'+time.getMinutes();
}
function hTime(){
  var time = new Date();
  return time.getHours()+':'+time.getMinutes();
}
function issame(v1,v2){
  return v1===v2;
}
function text_filter(data){
  if(typeof data === 'object'){
    var reg = /[\n"\\]/g;
    for(var para in data){
      data[para] = data[para].replace(reg,'');
    }
  }
}
function zPost(url,object){
  var form = document.createElement('form');
  form.action = url;
  form.method = 'post';
  form.target = "_self"; 
  form.style.display = "none";
  if(typeof object === 'object'){
    for(var para in object){
      var input = document.createElement('input');
      input.name = para;
      input.value = object[para];
      form.appendChild(input);
    }
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
  };
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
  };
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
  };
}

function jsonKeep(data){
  return data.replace(/&#34;/g, '\"');
}