const mongoose = require('bluebird').promisifyAll(require('mongoose'));

let StockSchema = new mongoose.Schema({
	name: {type: String, unique: true},
	code: String
});

module.exports = mongoose.model('Stock', StockSchema);


