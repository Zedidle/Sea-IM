const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes/routes')(app);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var logintime = {};

io.on('connection', function(socket){
	socket.on('loginjudge',function(uid){
		console.log(uid + ' login');
		setTimeout(function(){
			console.log(uid + ' logoff');
		},19000);
	})
});


const ip = '127.0.0.1';
const port = 8001;

server.listen(port,ip,function(){ console.log(ip+':'+port); });