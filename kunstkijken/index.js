require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const compression = require('compression')

const config = { port: 3000 }

const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env

const app = express();

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;
 
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {return false}
  return compression.filter(req, res)
}

app.set('view engine', 'ejs').
use(compression({ filter: shouldCompress })).
set('views', 'views').
use(express.static('public', {
  etag: true, // Just being explicit about the default.
  lastModified: true,  // Just being explicit about the default.
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // All of the project's HTML files end in .html
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  },
})).
use(express.json()).
use(express.urlencoded({ extended: true })).
get('/post', function(req, res) { res.redirect('/posts'); }).
listen(PORT, LOCAL_ADDRESS, function() { console.log(`Application started on port: ${PORT}`);});

async function fetchData(id = '',name = '' ) {
	const fetchUrl = `${endpoint}${id ? `${id}` : ''}?key=${key}&imgonly=True&${name ? `&q=${name}` : ''}`;
	try{
		return await fetch(fetchUrl).then(response => response.json()).then((data) => {return data});
		
	}catch(err){
		console.error(err)
	}
}
// Create a route for our overview page
app.get('/', async function(req, res) {


const dataresult = await fetchData();
const thumbnails = [];
const artObjects = dataresult.artObjects;

artObjects.forEach((artObject) => {
	const orginalImage = artObject.webImage.url;
	const editImage = orginalImage.slice(0, -1);
	const smallerImg = editImage + '400';
	const thumbnail = {
		number: artObject.objectNumber,
		imageUrl: smallerImg,
		imageWidth: 300 ,
		imageHeight: artObject.webImage.height / 8
	}
	thumbnails.push(thumbnail);
})
				
	res.render('posts', {
		title: 'Home', 
		postData: thumbnails
	});					
});

// Create a route for our detail page
app.get('/post/:id', async function(req, res) {
	const data = await fetchData(req.params.id, '');
		res.render('post', {
			title: 'Detail',
			postData: data.artObject
		});	
});

app.get('/search', async function(req,res){
	const data = await fetchData('', req.query.query);
		res.render('posts', {
			title: 'Zoeken', 
			postData: data
		});	
});


app.get('/offline', function(req, res){
	res.render('offline');
})
