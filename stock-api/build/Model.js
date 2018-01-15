'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var StockEvents = require('./socketEvents');

var StockSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	code: String
});

var emitEvent = function emitEvent(event) {
	return function (doc) {
		StockEvents.emit(event + ':' + doc._id, doc);
		StockEvents.emit(event, doc);
	};
};

StockSchema.post('save', emitEvent('save'));
StockSchema.post('remove', emitEvent('remove'));

module.exports = mongoose.model('Stock', StockSchema);