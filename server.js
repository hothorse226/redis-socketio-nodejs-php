 var express = require('express');
 var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io').listen(server);
 var redis = require('redis');
 users = [];
 connections = [];

 server.listen(3001);
 console.log('Server running ...');

 app.get('/', function(req, res) {
 	res.sendFile(__dirname + '/index.html');
 });

 io.sockets.on('connection', function(socket) {
 	var redisClient = redis.createClient();
 	redisClient.subscribe('message');

 	redisClient.on('message', function(channel, message) {
 		console.log('new message in queue '+ message+' channel');
 		socket.emit(channel, message);
 	});


 	connections.push(socket);
 	console.log('Connected: %s sockets connected', connections.length);

 	socket.on('disconnect', function(data) {
 		connections.splice(connections.indexOf(socket), 1);
 		console.log('Disconnected: %s sockets connected', connections.length);
 	});

 	// socket.on('send message', function(data) {
 		io.sockets.emit('new message', {msg: 'hello worlds'});
 	// });
 });