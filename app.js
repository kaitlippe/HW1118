var express = require('express'); //import library
var app = express(); //run express library
var server = require('http').Server(app);
var port = process.env.PORT || 9000; //for amazon web services
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/public'));

function serverUpCallBack() {
	console.log("listening on port: " + port);
}

var users = {};
function incomingSocket(socket){
	socket.on('new_user', function(data){
		users[socket.id] = data.pos; //for visitor as id give it its position
		io.emit('connected', {pos: data.pos}); //send positions and users
	});
	socket.on('disconnect', function(){
		if(users[socket.id]){
			var todel = users[socket.id]; 
			delete users[socket.id];
			io.emit('disconnected', { del: todel}); //send the users objects	
		}
	});
} 


io.on('connection', incomingSocket);

server.listen(port, serverUpCallBack);