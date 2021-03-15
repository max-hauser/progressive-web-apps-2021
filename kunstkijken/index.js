require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');


const config = { port: 3000 }

const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
// server.listen(PORT, LOCAL_ADDRESS, () => {
//   const address = server.address();
//   console.log('server listening at', address);
// });

const app = express();

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;

app.set('view engine', 'ejs').
set('views', 'views').
use(express.static('public')).
use(express.json()).
use(express.urlencoded({ extended: true })).
get('/post', function(req, res) { res.redirect('/posts'); }).
listen(PORT, LOCAL_ADDRESS, function() { console.log(`Application started on port: ${PORT}`);});


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
			title: 'Detail',
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
			title: 'Zoeken', 
			postData: data
		});	
	});	
});
