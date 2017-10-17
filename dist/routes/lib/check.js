function check(object,n){
	console.log('Check:'+n||'');
	console.log(object);
	console.log('Type: '+ typeof object);
	if(Array.isArray(object)){
		console.log('It is array,length is '+object.length);
	}
	console.log('');
}

module.exports = check;