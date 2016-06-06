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
var databaseUrl = "scraperDB";
var collections = ["smashing", "notes"];
var db = mongojs(databaseUrl, collections);

db.on('error', function(err) {
  console.log('Database Error:', err);
});

// Routes

app.get('/notes', function(req, res) {
	db.notes.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			console.log(found);
			res.json(found);
		}
	});
});


app.get('/scrape', function(req, res) {
	console.log('inside scrape');
	db.smashing.drop();
	request('https://www.smashingmagazine.com/', function(error, response, html) {

		var $ = cheerio.load(html);
		var result = [];

		$('.post').each(function(i, element){
			var title = $(this).children().children().attr('property', 'name').text();
			var link = $(this).children().children().attr('href');
			var content = $(this).children().next().next().text();
			content += $(this).children().next().next().next().next().text();


				// console.log('title: ', title);
				// console.log('link: ', link);
				// console.log('content: ', content);
			db.smashing.insert({
				title:title,
				link:link,
				content:content
			});
		});
	});
	res.redirect('/');
});

// //Save to DB
app.post('/submit', function(req, res) {

	db.notes.save(req.body, function(err, saved) {
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

//Get from DB


app.get('/all', function(req, res) {

	db.smashing.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});


//Find One in DB
app.get('/find/:id', function(req, res){

	console.log(req.params.id);
	db.notes.findOne({
			'_id': mongojs.ObjectId(req.params.id)
	}, function(err, found){
			if (err) {
					console.log(err);
					res.send(err);
			} else {
					console.log(found);
					res.send(found);
			}
	});

});


//Update One in the DB
app.post('/update/:id', function(req, res) {
	db.notes.update({'_id': mongojs.ObjectId(req.params.id)},
		{ $set:
			{
				'title': req.body.title,
				'note': req.body.note
			}
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
 	db.notes.remove({
 			'_id': mongojs.ObjectId(req.params.id)
 	}, function(err, found){
 			if (err) {
 					console.log(err);
 					res.send(err);
 			} else {
 					console.log(found);
 					res.send(found);
 			}
 	});
});


//Clear the DB
app.get('/clearall', function(req, res) {
 	db.smashing.remove({
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
