//made by ZFC, 2017.11.27

function check(obj,n){
	console.log('');
	console.log('Check:'+n||'');
	console.log('Content:'+ obj);
	console.log('   Type:'+ typeof obj);
	if(Array.isArray(obj)){
		console.log('It is array,length is '+obj.length);
	}
	if(typeof(obj) === 'string'){
		console.log(' Length:' + obj.length);
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
