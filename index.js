'use strict';

const express = require('express'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    expressSession = require('express-session'),
    app = express(),
    crypto = require('crypto'),
    request = require('request'),
    twit = require('twit'),
    bodyParser = require("body-parser"),
    TWITTER_CONSUMER_KEY = 'm5II3VjLWqLONLWKqMcGqxOvC',
    TWITTER_CONSUMER_SECRET = 'Ier7Pn2vEQOVESeokOh5pv6K2oZ4SactFRwdzZa24uUyiaxHxb';

    passport.use(new TwitterStrategy({

        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    
    }, function(token, tokenSecret, profile, done) {
        return done(null,profile); 
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});

const ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated() === false) {
		console.log('I dont think so!');
		res.redirect('/login');
		return;
	}
	next();
};

//Configuration
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'hasej2jrlekjwezef436563fj21af', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'pug');
app.set('views', 'views');


//Configuration


//Routes

let t = new twit({
    consumer_key : 'm5II3VjLWqLONLWKqMcGqxOvC',
    consumer_secret : 'Ier7Pn2vEQOVESeokOh5pv6K2oZ4SactFRwdzZa24uUyiaxHxb',
    access_token : '924278111704936448-PD9Zj7zhEzBUrYcwaEpR4HUCtHPmuVQ',
    access_token_secret : 'yaQqigS6qyqVQcSm7VfYWKieHgTEvUQuDakyzVz2ksLNn'
});








app.get('/', function(req, res)
{
  res.render('home', { title : "Our Site", info : "NHK"});
});



app.get('/bill/:bill_id', function(req, res)
{
    let viewData = {
        billNum : 'HB-108',
        info : 'NHK'
    };

    res.render('bill', viewData);
});




app.get('/login', passport.authenticate('twitter', {failureRedirect : '/login', successRedirect : '/showBills'}));


app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login', successRedirect : '/' }));



const server = app.listen(3000, function() {

    console.log(`Server is listening on port ${ server.address().port }`)

});-


app.get('/tweet',ensureAuthenticated, function(req, res){
    try{
        t.post('statuses/update', {status : statusParam}, function(err, data, response) {
            res.json('{msg" : "success"}'); 
        });
    } catch{
        res.json("{'msg' : 'failure', 'error' : " + e + " }"); 
    }
    
});

app.get('/checkLogin',ensureAuthenticated, function(req,res){

});
