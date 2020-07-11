const express = require('express');
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const socketio = require('socket.io')
const Filter = require('bad-words');
const {
	generateMessage, 
	generateLocationMessage
} = require('./utils/messages')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

io.on('connection', (socket) => {
	console.log('New websocket connection');

	socket.emit('message', generateMessage('Welcome'));

	socket.broadcast.emit('message', generateMessage('A new user has joined'))

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter();
		if(filter.isProfane(message)){
			return callback('Profanity is not allowed!')
		}

		io.emit('message', generateMessage(message));
		callback();
	})

	socket.on('sendLocation', (location, callback) => {
		callback()
		io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
	});

	socket.on('disconnect', () => {
		io.emit('message', generateMessage('A user has left'))
	})

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
})

// app.route('/')
// .get(async(req, res) => {
// 	res.render('index', {
// 		heading: 'Chat App'
// 	})
// })
