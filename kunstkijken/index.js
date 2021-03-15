require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');


const config = { port: 3000 }
const app = express();

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;

app.set('view engine', 'ejs').
set('views', 'views').
use(express.static('public')).
use(express.json()).
use(express.urlencoded({ extended: true })).
get('/post', function(req, res) { res.redirect('/posts'); }).
listen(config.port, function() { console.log(`Application started on port: ${config.port}`);});


// Create a route for our overview page
app.get('/', function(req, res) {
	const url = `${endpoint}?key=${key}`;	
	fetch(url).then(res => res.json()).then(data => {
		res.render('posts', {
			title: 'Home', 
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

app.get('/search', function(req,res){
	const	name =  req.query.query;
	const url = `${endpoint}?key=${key}&q=${name}`;
	fetch(url).then(res => res.json()).then(data => {
		console.log(data);
		res.render('posts', {
			title: 'Home', 
			postData: data
		});	
	});	
});
