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
    TWITTER_CONSUMER_SECRET = 'Ier7Pn2vEQOVESeokOh5pv6K2oZ4SactFRwdzZa24uUyiaxHxb',
    openstates = require('./modules/openstates.js');


const BILL_NUM_REGEX = /^[SH][CJ]?[BR]-\d{1,4}/gmi
const ERROR_PAGE_TEXTS = {
    404 : "Woops, we couldn't find that bill or page.",
    500 : "An internal server error occured."
}

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
app.use(express.static('resources'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'hasej2jrlekjwezef436563fj21af', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'pug');
app.set('views', 'views');
//Configuration

let t = new twit({
    consumer_key : 'm5II3VjLWqLONLWKqMcGqxOvC',
    consumer_secret : 'Ier7Pn2vEQOVESeokOh5pv6K2oZ4SactFRwdzZa24uUyiaxHxb',
    access_token : '924278111704936448-PD9Zj7zhEzBUrYcwaEpR4HUCtHPmuVQ',
    access_token_secret : 'yaQqigS6qyqVQcSm7VfYWKieHgTEvUQuDakyzVz2ksLNn'
});

//Routes

app.get('/error/:status_code', function(req, res)
{
  let status_code = req.params.status_code || 500;
  res.status(status_code);

  res.render('error', { errorText: ERROR_PAGE_TEXTS[status_code] });
});

app.get('/', function(req, res)
{
openstates.getCurrentBills(5, 'upper');
  res.render('legislation', { title : "Our Site", info : "NHK"});
});


function alphaNumericStrip(str){
    return str.replace(/[\W_]/g, '');
    //return str; 
}

app.get('/bill/:bill_id', function(req, res)
{
    let selectedBill = req.params.bill_id || '';
    if(!expressSession.nonce){
        expressSession.nonce = alphaNumericStrip(crypto.randomBytes(32).toString('base64'));
    }

    // if(BILL_NUM_REGEX.test(selectedBill) !== true)
    // {
    //     res.redirect('/error/404');
    //     return;
    // }

    openstates.getBillData("Missouri", "2019", selectedBill.replace('-', ' ').toUpperCase(),
        
    function(billData)
    {
        res.render('bill', { billData, nonce : expressSession.nonce });
    });
});


app.get('/login', passport.authenticate('twitter', {failureRedirect : '/login', successRedirect : '/showBills'}));


app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login', successRedirect : '/' }));


const server = app.listen(3000, function() {

    console.log(`Server is listening on port ${ server.address().port }`)

});


const ensureAuthenticatedTweet = function(req, res, next) {
    console.log('session nonce: ' + expressSession.nonce);
    console.log('ajax nonce : ' + req.query.nonce);
    console.log('ajax status : ' + req.query.nonce);
	if (!(req.query.nonce === expressSession.nonce)){
		console.log('I dont think so!');
		res.json("{'msg' : 'failure', 'error' : 'nonces did not match' }");
		return;
	}
	next();
};


app.get('/tweet',ensureAuthenticatedTweet, function(req, res){
    try{
        
        t.post('statuses/update', {status : req.query.status}, function(err, data, response) {
            res.json('{msg" : "success"}'); 
        });
    } catch{
        res.json("{'msg' : 'failure', 'error' : " + e + " }"); 
    }
    
});

app.get('/checkLogin',ensureAuthenticated, function(req,res){

});
