// function zhuajiu(prop1,prop2,i,n){

// 	if(i===n+1){return;}

// 	let m = 1/(n-i);

// 	let v = prop1*(1-prop2)*m;

// 	var prop1 = prop1*(1-prop2);

// 	var prop2 = m;

// 	zhuajiu(prop1,prop2,i+1,n);
// }

// var n=10;
// var p = 1/n;

// zhuajiu(1,p,1,10)



function zhuajiu(prop1,prop2,i,n){
	if(i===n){return;}
	let m = 1/(n-i);
	let v = prop1*(1-prop2)*m;
	console.log(v)
	zhuajiu(prop1*(1-prop2),m,i+1,n);
}

var n=10;
var p = 1/n;
zhuajiu(1,p,1,2);