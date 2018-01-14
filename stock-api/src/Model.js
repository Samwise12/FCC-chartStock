const mongoose = require('bluebird').promisifyAll(require('mongoose'));
let StockEvents = require('./socketEvents');

let StockSchema = new mongoose.Schema({
	name: {type: String, unique: true},
	code: String
});

const emitEvent = event => (
	doc => {
			StockEvents.emit(event + ':' + doc._id, doc);
			StockEvents.emit(event, doc);
		}
	);

	StockSchema.post('save', emitEvent('save'));
	StockSchema.post('remove', emitEvent('remove'));

module.exports = mongoose.model('Stock', StockSchema);


