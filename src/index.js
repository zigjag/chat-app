const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
})

app.route('/')
.get(async(req, res) => {
	res.render('index', {
		heading: 'Chat App'
	})
})
