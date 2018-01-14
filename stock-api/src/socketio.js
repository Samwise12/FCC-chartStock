const onDisconnect = socket => {};
const onConnect = socket => {
	console.log('socket connected');
	socket.on('info', data=> {
		socket.log(JSON.stringify(data, null, 2));
	});

	require('./socket')(socket)
};

exports = module.exports = function(socketio) {
	socketio.on('connection', socket=> {
		socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;
		socket.connectAt = new Date();
		socket.log = (...data) => {
			console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`/*, ...data*/);
		};

		//Call onDisconnect
		socket.on('disconnect', ()=> {
			onDisconnect(socket);
			socket.log('DISCONNECTED');
		});

		//Call onConnect
		onConnect(socket);
		socket.log('CONNECTED');
	});
}




