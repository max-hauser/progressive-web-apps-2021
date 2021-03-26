require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const compression = require('compression')
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const sharp = require('sharp');


let db;
const db_key = process.env.URI;
MongoClient.connect(db_key, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
  if(err){
    throw err
  }
  db = client.db('kunstkijken');
});

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
use(express.static('public')).
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


	db.collection('images').find({}).toArray(check)
	async function check(err, data) {
		if(err){
			console.log(err)
		}else{
			if(data.length == 0){
				console.log('data', data);
				const dataresult = await fetchData();
				const thumbnails = [];
				const artObjects = dataresult.artObjects;
				artObjects.forEach((artObject) => {
					const originalImage = artObject.webImage.url;
					const dimentions = '400';
					const smallerImage = originalImage.slice(0, -1) + dimentions
					
					const thumbnail = {
						number: artObject.objectNumber,
						imageUrl: smallerImage,
						imageWidth: 300 ,
						imageHeight: artObject.webImage.height / 8
					}
					thumbnails.push(thumbnail);
				})
				
				db.collection('images').insertOne({
					album: thumbnails
				})
			}else{
				console.log('we hebben data in de database')
				const imgHolder = [];
				data.forEach( (img)=>{
					imgHolder.push(img);
				})
				res.render('posts', {
					title: 'Home', 
					postData: imgHolder[0].album
				});					
			}
		}	
	}
		// res.render('posts', {
		// 	title: 'Home', 
		// 	postData: [{imageUrl: 'yep', imageWidth: '300', imageHeight: '300', number: '1'}]
		// });	
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
