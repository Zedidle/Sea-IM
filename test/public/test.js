

function createExpressions(){
	var faces = document.getElementById('faces');
	for(var i=0;i<50;i++){
		console.log(i);
		var d = document.createElement('div');
		d.style.backgroundPosition = 'left -'+i*30+'px'; 		
		d.style.backgroundImage = 'url(img/faces.png)'; 
		d.value = i;
		// d.onclick = changeToInput;
		d.onclick = faceChange;
		faces.appendChild(d);
	}
}
createExpressions();

function faceChange(){
	var t = this.value;
	var input = document.getElementsByTagName('input')[0];
	var end = input.selectionEnd;
	var iv = input.value;
	input.value = iv.substr(0,end) + "#("+t+")" + iv.substr(end,iv.length);
}  




// function changeToInput(){
// 	var t;
// 	switch(this.value){
// 		case 0:t = '呵呵'; break;
// 		case 1:t = '哈哈'; break;
// 		case 2:t = '吐舌'; break;
// 		case 3:t = '啊'; break;
// 		case 4:t = '酷'; break;
// 		case 5:t = '怒'; break;
// 		case 6:t = '开心'; break;
// 		case 7:t = '汗'; break;
// 		case 8:t = '泪'; break;
// 		case 9:t = '黑线'; break;
// 		case 10:t = '鄙视'; break;
// 		case 11:t = '不高兴'; break;
// 		case 12:t = '真棒'; break;
// 		case 13:t = '钱'; break;
// 		case 14:t = '疑问'; break;
// 		case 15:t = '阴险'; break;
// 		case 16:t = '吐'; break;
// 		case 17:t = '咦'; break;
// 		case 18:t = '委屈'; break;
// 		case 19:t = '花心'; break;
// 		case 20:t = '呼'; break;
// 		case 21:t = '笑眼'; break;
// 		case 22:t = '冷'; break;
// 		case 23:t = '太开心'; break;
// 		case 24:t = '滑稽'; break;
// 		case 25:t = '勉强'; break;
// 		case 26:t = '狂汗'; break;
// 		case 27:t = '乖'; break;
// 		case 28:t = '睡觉'; break;
// 		case 29:t = '惊哭'; break;
// 		case 30:t = '升起'; break;
// 		case 31:t = '惊讶'; break;
// 		case 32:t = '喷'; break;
// 		case 33:t = '爱心'; break;
// 		case 34:t = '心碎'; break;
// 		case 35:t = '玫瑰'; break;
// 		case 36:t = '礼物'; break;
// 		case 37:t = '彩虹'; break;
// 		case 38:t = '星星月亮'; break;
// 		case 39:t = '太阳'; break;
// 		case 40:t = '钱币'; break;
// 		case 41:t = '灯泡'; break;
// 		case 42:t = '咖啡'; break;
// 		case 43:t = '蛋糕'; break;
// 		case 44:t = '音乐'; break;
// 		case 45:t = 'haha'; break;
// 		case 46:t = '胜利'; break;
// 		case 47:t = '大拇指'; break;
// 		case 48:t = '弱'; break;
// 		case 49:t = 'ok'; break;
// 	}
// 	console.log("#("+t+")");
// 	// return "#("+t+")";

// 	var input = document.getElementsByTagName('input')[0];
// 	var end = input.selectionEnd;
// 	var iv = input.value;
// 	input.value = iv.substr(0,end) + "#("+t+")" + iv.substr(end,iv.length);
// }  





setInterval(function(){
	socket.emit('loginjudge','z00000');
},10000);