	function check(object,num){
		console.log('Check:'+num||'');
		console.log(object);
		console.log('Type: '+typeof object);
		if(Array.isArray(object)){
			console.log('It is array,length is '+object.length);
		}
	}

	module.exports = check;