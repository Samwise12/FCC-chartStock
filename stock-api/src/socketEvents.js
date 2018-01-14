let EventEmitter = require('events').EventEmitter;
let StockEvents = new EventEmitter();

// Set max event listeners (0 === ulimited)
StockEvents.setMaxListeners(0);

module.exports = StockEvents;