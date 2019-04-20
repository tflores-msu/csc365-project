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

const server = app.listen(3000, function() {

  console.log(`Server is listening on port ${ server.address().port }`)

});