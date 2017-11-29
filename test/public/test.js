console.log(666);
var uid = 'z00000';


setInterval(function(){
	socket.emit('loginjudge',uid);
	console.log(uid + ' login');
},10000);