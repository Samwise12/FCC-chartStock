'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('babel-polyfill');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _data = require('./routes/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
}


var app = (0, _express2.default)();
var server = require('http').Server(app);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var PORT = process.env.PORT || 8080;

// app.use(morgan('dev'));
app.use(_express2.default.static(_path2.default.resolve(__dirname, '../../stock/build')));
app.use(_bodyParser2.default.json());
app.use((0, _cors2.default)());

// mongoose.Promise = global.Promise *fix mpromise issue without bluebird
_mongoose2.default.Promise = _bluebird2.default;
var dbUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
_mongoose2.default.connect(dbUrl, { useMongoClient: true }).then(function () {
  console.log('mongodb running local mongodb');
}, function (err) {
  console.log('error!:', err);
});

app.use('/api/data', _data2.default);

app.get('*', function (req, res) {
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.sendFile(_path2.default.resolve(__dirname, '../../stock/build', 'index.html'));
});
//-----SOCKET.IO
var io = require('socket.io')(server, {
  path: '/stockchart'
});
require('./socketio')(io);

server.listen(PORT, function () {
  return console.log('Listening on port ' + PORT);
});