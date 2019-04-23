'use strict';

const express = require('express'),
  app = express();

//Configuration
app.use(express.static('static'));
app.set('view engine', 'pug');
app.set('views', 'views');

//Routes

app.get('/', function(req, res)
{
  res.render('home', { title : "Our Site", info : "NHK"});
});

app.get('/search', function(req, res)
{
  res.render('search', { title : "Our Site", info : "NHK"});
});

app.get('/bill/:bill_id', function(req, res)
{
  let viewData = {
    billNum : 'HB-108',
    info : 'NHK'
  };

  res.render('bill', viewData);
});

const server = app.listen(3000, function() {

  console.log(`Server is listening on port ${ server.address().port }`)

});