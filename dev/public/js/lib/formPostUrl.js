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