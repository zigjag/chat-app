const express = require('express');
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

io.on('connection', (socket) => {
	console.log('New websocket connection');
	socket.emit('message', "Welcome!");
	socket.broadcast.emit('message', 'A new user has joined')

	socket.on('sendMessage', (sendMessage) => {
		io.emit('sendMessage', sendMessage)
	})

	socket.on('sendLocation', (location) => {
		io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
	});

	socket.on('disconnect', () => {
		io.emit('message', 'A user has left')
	})

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
})

app.route('/')
.get(async(req, res) => {
	res.render('index', {
		heading: 'Chat App'
	})
})
