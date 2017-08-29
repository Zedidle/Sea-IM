
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

	

function render(username,buildteam,jointeam,buildtip,jointip){
var doc = document;

    doc.querySelector('buildtip').innerText = buildtip;
    doc.querySelector('jointip').innerText = jointip;

    if(buildtip.length){
    doc.querySelector('#update').style.display = 'none';
    }

	doc.querySelector('#back').onclick = function(){
    	var data = {
    		username:username
    	}
    	formPostUrl('/main',data);
    }
    doc.querySelector('#update').onclick = function(){
        var data = {
            username:username
        }
        formPostUrl('/teams',data)
    }


    var reg = new RegExp('&#34;','g');

    
    var bteam = doc.querySelector('bteam');
    if(buildteam.length){
    var buildteam = buildteam.replace(reg,"\"");
        buildteam = JSON.parse(buildteam);

        var 
            info = doc.createElement('info'),
            id = doc.createElement('id'),
            teamname = doc.createElement('teamname'),
            level = doc.createElement('level'),
            membernumber = doc.createElement('membernumber'),
            major = doc.createElement('major'),
            introduce = doc.createElement('introduce'),
            avator = doc.createElement('avator'),
            img = doc.createElement('img');

            avator.appendChild(img);
            info.appendChild(id);
            info.appendChild(teamname);
            info.appendChild(level);
            info.appendChild(membernumber);
            info.appendChild(major);
            info.appendChild(introduce);

            bteam.appendChild(avator);
            bteam.appendChild(info);

            img.src = buildteam.headImg;
            id.innerText = 'ID: '+buildteam.id;
            teamname.innerText = 'Teamname: '+buildteam.teamname;
            level.innerText = 'Level: '+buildteam.level;
            membernumber.innerText = 'Member number: '+buildteam.membernumber;
            major.innerText = 'Major: '+buildteam.major;
            introduce.innerText = 'Introduce: '+buildteam.introduce;
    }


    var jteamul = doc.querySelector('jteam ul');
    var jointeam = jointeam.replace(reg,"\"");
        jointeam = JSON.parse(jointeam);
    
        jointeam.forEach(function(a){

            var 
                li = doc.createElement('li'),
                info = doc.createElement('info'),
                id = doc.createElement('id'),
                teamname = doc.createElement('teamname'),
                level = doc.createElement('level'),
                membernumber = doc.createElement('membernumber'),
                major = doc.createElement('major'),
                introduce = doc.createElement('introduce'),
                avator = doc.createElement('avator'),
                img = doc.createElement('img');

            avator.appendChild(img);
            info.appendChild(id);
            info.appendChild(teamname);
            info.appendChild(level);
            info.appendChild(membernumber);
            info.appendChild(major);
            info.appendChild(introduce);

            li.appendChild(avator);
            li.appendChild(info);

            jteamul.appendChild(li);

            img.src = a.headImg;
            id.innerText = 'ID: '+a.id;
            teamname.innerText = 'Teamname: '+a.teamname;
            level.innerText = 'Level: '+a.level;
            membernumber.innerText = 'Member number: '+a.membernumber;
            major.innerText = 'Major: '+a.major;
            introduce.innerText = 'Introduce: '+a.introduce;

        })

}
