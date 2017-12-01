var av;
var n = 10;
while(av = n--){
	console.log(av);
}
















function $(o){
	var $ = new Object;
	$.value = o;
	$.sayName = function(){
		console.log('my name');
	}
	$.run = function(){
		console.log('running');
	}
	$.get = function(){
		return this.value;
	}
	return $;
}

var a = 100;
$(a).sayName();
$(a).run();
console.log($(a).get());
console.log($(a));


var b = {
	value:200,
}
$(b).sayName();
console.log($(b).get().value);


console.log('\n');

if(true){
	var d = 300;
}else{
	var d = 400;
}

console.log(d);
console.log('\n');

var e;
if(false){
	e = 1000;
}else{
	e = 2000;
}
console.log(e);
console.log('\n');


d = 500;
console.log(d);

d = true?700:800;
console.log(d);

console.log((false?'0':'60')+'px');
console.log(false?'0':'60'+'px');