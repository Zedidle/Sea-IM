function people(e){var t=document;t.getElementById("headImg").onclick=function(){t.getElementById("peopleHeadForm").style.display="block"},t.getElementById("back").onclick=function(){var t={username:e};formPostUrl("/main",t)},$("#headUpdate").click(function(){if(!$("#avator").val().length)return $("#avator").css("border","solid 1px #449933"),!1;var a=t.createElement("input");a.style.display="none",a.name="username",a.value=e;var n=$("#peopleHeadForm");n.append(a),n.submit()}),$("#textUpdate").click(function(){var t=$("#nickname").val().trim(),a=$("#introduce").val().trim(),n=$("#sex").val().trim(),r=$("#hobby").val().trim(),o=$("#birthday").val().trim();if(t.length>10)return $("#nickname").css("border","solid 1px red"),$("button#textUpdate").text("昵称字数过长"),setTimeout(function(){$("button#textUpdate").text("更新")},2e3),!1;if(a.length>60)return $("textarea#introduce").css("border","solid 1px red"),$("button#textUpdate").text("简介字数不能超过6０"),setTimeout(function(){$("button#textUpdate").text("更新")},2e3),!1;var i={username:e,nickname:t,introduce:a,sex:n,hobby:r,birthday:o};!function(e){if("object"==typeof e){var t=/[\n"\\]/g;for(para in e)e[para]=e[para].replace(t,"")}}(i),postChangeText("/peopleT",i,function(e){$("#nickname").val(e.nickname),$("#introduce").val(e.introduce),$("#sex").val(e.sex),$("#hobby").val(e.hobby),$("#birthday").val(e.birthday)})})}