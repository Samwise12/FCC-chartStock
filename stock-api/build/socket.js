'use strict';

var StockEvents = require('./socketEvents');

var events = ['save', 'remove'];

var createListener = function createListener(event, socket) {
	return function (doc) {
		return socket.emit(event, doc);
	};
};

var removeListener = function removeListener(event, listener) {
	return function () {
		return StockEvents.removeListener(event, listener);
	};
};

var register = function register(socket) {
	for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
		var event = events[i];
		var listener = createListener('stock:' + event, socket);

		StockEvents.on(event, listener);
		socket.on('disconnect', removeListener(event, listener));
	}
};

module.exports = register;