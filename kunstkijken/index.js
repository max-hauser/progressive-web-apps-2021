// Require third-party modules
const express = require('express');
const fetch = require('node-fetch');

// Config object
const config = { port: 3000 }
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

const endpoint = 'https://www.rijksmuseum.nl/api/nl/collection/';
const key = 'SM7rr6VN';

// Actually set up the server
app.listen(config.port, function() {
	console.log(`Application started on port: ${config.port}`);
});

// Create a route for our overview page
app.get('/', function(req, res) {
	const url = `${endpoint}?key=${key}`;	
	fetch(url).then(res => res.json()).then(data => {
		res.render('posts', {
			title: 'Posts', // We use this for the page title, see views/partials/head.ejs
			postData: data
		});	
	});
});

// Create a route for our detail page
app.get('/post/:id', function(req, res) {
	const url = `${endpoint}/${req.params.id}?key=${key}`;
	fetch(url).then(res => res.json()).then(data => {
		res.render('post', {
			title: 'Post ${req.params.id}',
			postData: data.artObject
		});	
	});	
});

// Make sure to catch /post to /posts
app.get('/post', function(req, res) {
	// Redirect the client using res.redirect (this will create a new request)
	res.redirect('/posts');
});

