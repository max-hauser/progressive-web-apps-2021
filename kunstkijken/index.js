// Require third-party modules
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

// Config object
const config = { port: 3000 }

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

// Create a route for our overview page
app.get('/', function(req, res) {
	const endpoint = 'https://www.rijksmuseum.nl/api/nl/collection/';
	const key = 'SM7rr6VN';
	const url = `${endpoint}?key=${key}`;	
	request(`${url}`, {json: true}, function (err, requestRes, body){
		if (err) {
			res.send(err);
		} else {
			res.render('posts', {
				title: 'Posts', 
				postData: body.artObjects
			});
		}
	});
});

// Create a route for our detail page
app.get('/post/:id', function(req, res) {

	const endpoint = 'https://www.rijksmuseum.nl/api/nl/collection';
	const key = 'SM7rr6VN';	
	const url = `${endpoint}/${req.params.id}?key=${key}`;
	
	console.log(url)

	request(url, {json: true}, function (err, requestRes, body){
		if (err) {
			// We got an error
			res.send(err);
		} else {
			console.log(body);
			//Render the page using the 'post' view and our body data
			res.render('post', {
				title: `Post ${req.params.id}`, 
				postData: body.artObject
			});
		}
	});
});

// Make sure to catch /post to /posts
app.get('/post', function(req, res) {
	// Redirect the client using res.redirect (this will create a new request)
	res.redirect('/posts');
});

// Actually set up the server
app.listen(config.port, function() {
	console.log(`Application started on port: ${config.port}`);
});