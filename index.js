'use strict';

const express = require('express'),
    passport = require('passport'),
    Strategy = require('passport-twitter').Strategy,
    expressSession = require('express-session'),
    app = express(),
    crypto = require('crypto'),
    openstates = require('./openstates.js');

const TWITTER_CONSUMER_KEY = 'Po4ZNAfWvEHAr3vuHS1LcNGzP';
const TWITTER_CONSUMER_SECRET = 'R2SCzindQgTviFNr05CviP3GbRDvLedb95N8LZ000KkMCVj225';
const BILL_NUM_REGEX = /^[SH]B-\d{3}/gmi

const ERROR_PAGE_TEXTS = {
    404 : "Woops, we couldn't find that bill or page.",
    500 : "An internal server error occured."
}

passport.use(new Strategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
}, function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


//Configuration
app.use(express.static('static'));
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
//Routes

app.get('/error/:status_code', function(req, res)
{
  let status_code = req.params.status_code || 500;
  res.status(status_code);

  res.render('error', { errorText: ERROR_PAGE_TEXTS[status_code] });
});

app.get('/legislation', function(req, res)
{
  res.render('legislation', { title : "Our Site", info : "NHK"});
});

app.get('/bill/:bill_id', function(req, res)
{
    let selectedBill = req.params.bill_id;

    if(selectedBill && BILL_NUM_REGEX.test(selectedBill))
    {
        openstates.getBillData("Missouri", "2019", selectedBill.replace('-', ' ').toUpperCase(),
        
        function(billData)
        {
            res.render('bill', { billData });
        });
    }
    else
    {
        res.redirect('/error/404')
    }
});

app.get('/login', passport.authenticate('twitter'));

const server = app.listen(3000, function() {

  console.log(`Server is listening on port ${ server.address().port }`)

});

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);


app.get('/tweet', function(req, res){
  res.render('twittertest');
});
app.get('/webhooks/twitter', function(req,res){
    hmac = crypto.createHmac('sha256', TWITTER_CONSUMER_SECRET).update(req.query.crc_token).digest('base64');
    res.json({ 'response_token' : 'sha256=' + hmac});
});