'use strict';

var onDisconnect = function onDisconnect(socket) {};
var onConnect = function onConnect(socket) {
	console.log('socket connected');
	socket.on('info', function (data) {
		socket.log(JSON.stringify(data, null, 2));
	});

	require('./socket')(socket);
};

exports = module.exports = function (socketio) {
	socketio.on('connection', function (socket) {
		socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;
		socket.connectAt = new Date();
		socket.log = function () {
			console.log('SocketIO ' + socket.nsp.name + ' [' + socket.address + ']' /*, ...data*/);
		};

		//Call onDisconnect
		socket.on('disconnect', function () {
			onDisconnect(socket);
			socket.log('DISCONNECTED');
		});

		//Call onConnect
		onConnect(socket);
		socket.log('CONNECTED');
	});
};