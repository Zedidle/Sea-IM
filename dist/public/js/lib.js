// void function(){
//   const cdnurl = [
//       'https://cdn.bootcss.com/vue/2.5.7/vue.min.js',
//       'https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js',
//       'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js'
//       ];
//   var body = document.getElementsByTagName('body')[0]; 
//   console.log(body);
//   for(let i of cdnurl){
//     console.log(i);
//     var s = document.createElement('script');
//     s.src=i;
//     body.appendChild(s);
//   }
// }();















Array.prototype.pull = function(o){
  for(let i in this){
    if(this[i] === o){
      this.splice(i,1);
    }
  }
  return this;
}


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

function getTime(){
  var time = new Date();
  return time.getHours()+':'+time.getMinutes();
}
function getDayTime(){
  var time = new Date();
  var month = parseInt(time.getMonth())+1;
  return month+ '.' +time.getDate()+'  '+time.getHours()+':'+time.getMinutes();
}

function ytime(){
     var time = new Date();
     var month = time.getMonth()+1;
     time = time.getFullYear()+'-'+month+ '-' +time.getDate()+'   '+time.getHours()+':'+time.getMinutes();
     return time;
}

function issame(v1,v2){
  return (v1===v2)?true:false;
}

function text_filter(data){
  if(typeof data === 'object'){
    var reg = /[\n"\\]/g;
    for(para in data){
      data[para] = data[para].replace(reg,'');
    }
  }
};

function formPost(url,object){
  var form = document.createElement('form');
  form.action = url;
  form.method = 'post';
  form.target = "_self"; 
  form.style.display = "none";
  for(var para in object){
    var input = document.createElement('input');
    input.name = para;
    input.value = object[para];
    form.appendChild(input);
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




function regKeepJSON(data){
  return data.replace(/&#34;/g, '\"');
}