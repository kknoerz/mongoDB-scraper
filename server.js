var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));


//Database configuration
var mongojs = require('mongojs');
// var databaseUrl = "scraperDB";
// var collections = ["smashing", "notes"];
// var db = mongojs(databaseUrl, collections);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scraperDB');
var db = mongoose.connection;

db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});
db.once('open', function () {
	console.log('Mongoose connection successful.');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/scrape', function(req, res) {
	mongoose.connection.db.dropCollection('articles', function(err, result){
		console.log('articles cleared...');
	});
	request('https://www.smashingmagazine.com/', function(error, response, html) {
		var $ = cheerio.load(html);
		$('.post').each(function(i, element){

			var result = {};

			result.title = $(this).children().children().attr('property', 'name').text();
			result.link = $(this).children().children().attr('href');
			result.content = $(this).children().next().next().text();
			result.content += $(this).children().next().next().next().next().text();


			var entry = new Article (result);

			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});
	});
	res.redirect('/');
});

app.get('/notes', function(req, res) {
	Note.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			console.log(found);
			res.json(found);
		}
	});
});

app.post('/submit', function(req, res) {
	var newNote = new Note(req.body);
	console.log('inside submit: ', req.body);

	newNote.save(function(err, saved) {
		console.log('req.body inside submit: ', req.body);
    if (err) {
      console.log(err);
    } else {
			console.log('inside submit, saved: ', saved);
      res.send(saved);
    }
  });
	console.log("This is response inside submit: ", res.body);
	// res.send()
});



app.get('/articles', function(req, res) {

	Article.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.send(found);
		}
	});
});


//Find note in DB
app.get('/find/:id', function(req, res){

	console.log(req.params.id);
	Note.findOne({'_id': req.params.id}, function(err, found){
			if (err) {
					console.log(err);
					res.send(err);
			} else {
					console.log('inside find/:id: ', found);
					res.send(found);
			}
	});

});


//Update Note in the DB
app.post('/update/:id', function(req, res) {

	Note.update({'_id': req.params.id},
			{
				'title': req.body.title,
				'note': req.body.note,
			}, function(err, found) {

				if (err) {
						res.send(err);
				} else {
						console.log('inside update, found: ', found);
						res.send(found);
				}

	});
});


//Delete One from the DB
app.get('/delete/:id', function(req, res) {

	console.log(req.params.id);

	Note.find({'_id': req.params.id}).remove().exec(function(err, found){
		if (err) {
				console.log(err);
				res.send(err);
		} else {
				console.log('removed');
				res.send('found and removed');
		}
	});
});


//Clear the DB
app.get('/clearall', function(req, res) {
 	db.articles.remove({
 			'_id': mongojs.ObjectId(err, saved)
 	}, function(err, found){
 			if (err) {
 					console.log(err);
 					res.send(err);
 			} else {
 					console.log(found);
 					res.send();
 			}
 	});
});



app.listen(3000, function() {
  console.log('App running on port 3000!');
});
