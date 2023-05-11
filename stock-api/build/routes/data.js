'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _circularJson = require('circular-json');

var _circularJson2 = _interopRequireDefault(_circularJson);

var _Model = require('../Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

///// Routes
router.get('/', function (req, res) {
	_Model2.default.findAsync().then(function (response) {
		res.status(200).json({ data: response });
	});
});

router.get('/:code', function (req, res) {
	console.log("A");
	// console.log(req.params.code)
	var name = req.params.code,
	    now = new Date(),
	    year = now.getFullYear(),
	    month = now.getMonth() + 1,
	    date = now.getDate();
	(0, _axios2.default)({
		method: 'get',
		url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + name + '.json?api_key=' + process.env.API_KEY + '&order=asc&start_date=' + (year - 7) + '-' + month + '-' + date + '&end_date=' + (year - 5) + '-' + month + '-' + date,
		responseType: 'json'
	}).then(function (response) {
		var x = _circularJson2.default.stringify(response);
		// console.log("Response",response);
		res.status(200).json({ data: x }).end();
	}).catch(function (err) {
		return console.log(err);
	});
});

router.post('/', function (req, res) {
	// Add stock
	// console.log(req.body.stockName)
	console.log("B");
	var name = req.body.stockName,
	    now = new Date(),
	    year = now.getFullYear(),
	    month = now.getMonth() + 1,
	    date = now.getDate();
	if (!name) {
		res.status(400).end();
		return;
	};
	(0, _axios2.default)({
		method: 'get',
		url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + name.toUpperCase() + '.json?api_key=' + process.env.API_KEY + '&order=asc&start_date=' + (year - 7) + '-' + month + '-' + date + '&end_date=' + (year - 5) + '-' + month + '-' + date,
		responseType: 'json'
	}).then(function (response) {
		// console.log("response",response.data);
		_Model2.default.findAsync({ code: response.data.dataset.dataset_code }).then(function (stock) {
			if (stock.length) {
				res.json({ err: 'Stock already displayed.' });
			} else {
				_Model2.default.createAsync({
					name: response.data.dataset.name,
					code: response.data.dataset.dataset_code
				});
				res.status(200).json({});
			};
		});
	}).catch(function (err) {
		console.log('ERROR!: ', err.response.data.quandl_error);
		res.status(200).json({ err: err.response.data.quandl_error }).end();
	});

	// res.status(200).json({})
});

router.delete('/:id', function (req, res) {
	_Model2.default.findByIdAsync(req.params.id).then(function (res) {
		res.removeAsync();
	}).then(function (response) {
		return res.status(204).end();
	}).catch(function (err) {
		return console.log('Error!zzz: ', err);
	});
});

exports.default = router;