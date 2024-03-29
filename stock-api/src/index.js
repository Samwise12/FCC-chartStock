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
//const server = require('http').Server(app);  
const server = require('http').createServer(app);  

if (process.env.NODE_ENV !== 'production'){require('dotenv').config()}
const PORT = process.env.PORT || 8080;

import data from './routes/data';

// app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '../../stock/build')));
app.use(bodyParser.json());
app.use(cors());

// mongoose.Promise = global.Promise *fix mpromise issue without bluebird
mongoose.Promise = Promise;
mongoose.set('strictQuery', true);
const dbUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
mongoose.connect(dbUrl).then(
 () => {console.log('mongodb running local mongodb')},
 err => {console.log('error!zz:', err)}
 );

app.use('/api/data', data);

app.get('*', (req, res) => {
	// res.sendFile(path.join(__dirname, 'index.html'));
    res.sendFile(path.resolve(__dirname, '../../stock/build', 'index.html'));	
})
//-----SOCKET.IO
const io = require('socket.io')(server, {
	path: '/stockchart'
});
require('./socketio')(io);

server.listen(PORT, process.env.IP , () => console.log(`Listening on port ${PORT}`));

