import express from 'express';
import "babel-polyfill";
import path from 'path';
import bodyParser from 'body-parser';
if (process.env.NODE_ENV !== 'production'){
	const dotenv = require('dotenv');
}
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import Promise from 'bluebird';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const server = require('http').Server(app);  

if (process.env.NODE_ENV !== 'production'){require('dotenv').config()}
const PORT = process.env.PORT || 8080;

import data from './routes/data';

// app.use(morgan('dev'));
// app.use(express.static(path.resolve(__dirname, '../../night-react/build')));
app.use(bodyParser.json());
app.use(cors());

// mongoose.Promise = global.Promise *fix mpromise issue without bluebird
mongoose.Promise = Promise;
const dbUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
mongoose.connect(dbUrl,
 { useMongoClient: true }).then(
 () => {console.log('mongodb running local mongodb')},
 err => {console.log('error!:', err)}
 );

app.use('/api/data', data);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
    // res.sendFile(path.resolve(__dirname, '../../night-react/build', 'index.html'));	
})
//-----SOCKET.IO
const io = require('socket.io')(server, {
	path: '/stockchart'
});
require('./socketio')(io);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

