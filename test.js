//jquey 1.11.3

// question1 
// var arr = ['1','2','3','4'];
// var result = [];
// var l = arr.length;
// for(var i=0;i<l;i++){
// 	for(var j=0;j<l;j++){
// 		for(var k=0;k<l;k++){
// 			if(ai!=aj&&ai!=ak&&aj!=ak){
// 				var r = arr[i]+arr[j]+arr[k];
// 				result.push(r);
// 			}
// 		}
// 	}
// }
// console.log('The length of result is '+result.length);
// console.log(result);





//question2 输入两个正整数　m和n ,求其最大公约数和最小公倍数
// var m = 15,n=12;
// var max,min;
// if(m>n){
// 	max = m;
// 	min = n;
// }else{
// 	max = n;
// 	min = m;
// }

// //求最大公约数
// for(var i=min;i>0;i--){
// 	if(m%i===0&&n%i===0){
// 		console.log('它们的最大公约数为'+i);
// 		break;
// 	}
// }
// //求最小公倍数
// for(var j=max;j<=m*n;j++){
// 	if(j%m===0&&j%n===0){
// 		console.log('它们的最小公倍数是:'+j);
// 		break;
// 	}
// }




//question3 一个整数，它加上１００后是一个完全平方数，再加上１６８又是一个完全平方数，请问该数是多少？
// for(var i=-99;;i++){
// 	var n1 = Math.sqrt(i+100);
// 	var n2 = Math.sqrt(i+268); 
// 	if( n1===parseInt(n1)&&n2===parseInt(n2) ){
// 		console.log(i)
// 	}
// }




//question4  输出国际象棋棋盘　10*10
// var judge=true;
// var column,row;
// while(judge){
// 	var c,r;
// 	c = prompt('请输入列数(数字小于100):');
// 	r = prompt('请输入行数(数字小于100):');
// 	if(!parseInt(c)||!parseInt(r)||parseInt(c)>100||parseInt(r)>100){
// 		alert('输入有误，请重新输入!');
// 	}else{
// 		judge=false;
// 		column = parseInt(c);
// 		row = parseInt(r);
// 	}
// }
// // NaN 是 false
// // console.log(!parseInt('a'));
// var father_width = 100*column;
// var father_height = 100*row;
// console.log('Father size(px): ',father_width,'*',father_height);

// var body = document.querySelector('body');
// var fatherDiv = document.createElement('div');
// fatherDiv.style.width = father_width+'px';
// fatherDiv.style.height = father_height+'px';
// fatherDiv.style.border = "solid 2px #60768E"
// fatherDiv.style.backgroundColor = '#bbb';
// body.appendChild(fatherDiv);

// var j=0;
// console.log("格子数:",column*row);
// var isColumnEven = (column%2===0);
	
// for(var i=0;i<column*row;i++){
// 	var sonDiv = document.createElement('div');
// 	var color =	((i+j)%2===0)?'#222':'#fff';
// 	if(isColumnEven&&(i+1)%column===0){ j++; }

// 	sonDiv.style.backgroundColor = color;
// 	sonDiv.style.width='100px';
// 	sonDiv.style.height='100px';
// 	sonDiv.style.float='left';
// 	fatherDiv.appendChild(sonDiv);
// }