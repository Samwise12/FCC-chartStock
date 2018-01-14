let StockEvents = require('./socketEvents');

let events = ['save', 'remove'];

const createListener = (event, socket) => (
	doc => socket.emit(event, doc)
	)

const removeListener = (event, listener) => (
	() => StockEvents.removeListener(event, listener)
	)

const register = socket => {
	for (let i=0, eventsLength=events.length; i< eventsLength; i++) {
		let event = events[i];
		let listener = createListener('stock:'+ event, socket);

		StockEvents.on(event, listener);
		socket.on('disconnect', removeListener(event, listener));
	}
}

module.exports = register;
