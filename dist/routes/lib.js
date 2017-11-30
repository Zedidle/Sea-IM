//made by ZFC, 2017.11.27

function check(object,n){
	console.log('');
	console.log('Check:'+n||'');
	console.log('Content:'+object);
	console.log('   Type:'+ typeof object);
	if(Array.isArray(object)){
		console.log('It is array,length is '+object.length);
	}
	if(typeof(object) === 'string'){
		console.log(' Length:' + object.length);
	}
	console.log('');
}

function ytime(){
	var time = new Date();
	var month = parseInt(time.getMonth())+1;
	time = time.getFullYear()+'.'+month+ '.' +time.getDate()+' '+time.getHours()+':'+time.getMinutes();
	return time;
}

function mtime(){
	var time = new Date();
	var month = parseInt(time.getMonth())+1;
	time = month+ '.' +time.getDate()+' '+time.getHours()+':'+time.getMinutes();
	return time;
}

function userRelogin(schema,uid){
	schema.update({uid:uid},{$set:{login:true}},err=>{});
}

function userFakeLogout(schema,uid){
	schema.update({uid:uid},{$set:{login:false}},err=>{});
}

module.exports = {
	ytime,
	mtime,
	check,
	userRelogin,
	userFakeLogout,
}
