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




	module.exports = {
		ytime,
		mtime,
	}