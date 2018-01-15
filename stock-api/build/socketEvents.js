'use strict';

var EventEmitter = require('events').EventEmitter;
var StockEvents = new EventEmitter();

// Set max event listeners (0 === ulimited)
StockEvents.setMaxListeners(0);

module.exports = StockEvents;