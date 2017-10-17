// 海滩上有一堆桃子，五只猴子来分.
// 第一只猴子把这堆桃子平均分为五份，多了一个．
// 这只猴子把多的一个扔入海中，拿走了一份．
// 第二只猴子把剩下的桃子又平均分为五份，又多了一个，
// 它同样把多的一个仍入海中，拿走了一份，第三/第四/第五只猴子都是这样做的．
// 问海滩上原来最少有多少个桃子？

// for(var i=6;;i++){
// 	var n = i;
// 	//第一只猴子
// 	if(n%5===1){
// 		n = n-parseInt(n/5)-1;
// 		if(n%5===1){
// 			//第二只猴子
// 			n = n-parseInt(n/5)-1;
// 			if(n%5===1){
// 				//第三只猴子
// 				n = n-parseInt(n/5)-1;
// 				if(n%5===1){
// 					//第四只猴子
// 					n = n-parseInt(n/5)-1;
// 					//由于n>5不是必要条件，所以在后面的递归中可以省略
// 					if(n>5&&n%5===1){
// 						//第五只猴子
// 						console.log(i);
// 						break;
// 						// n = n-parseInt(n/5)-1;
// 					}
// 				}
// 			}
// 		}
// 	}
// }

for(var i=6;;i++){
	if(picks(i,5)){
		console.log(i);
		break;
	}
}

//n个桃子以上面方法被选t次
function picks(n,t){
	if(t===0){
		return true;
	}
	if(n%5===1){
		return picks(n-parseInt(n/5)-1,t-1);
	}else{
		return false;
	}
}