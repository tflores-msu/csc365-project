'use strict';

const express = require('express'),
    passport = require('passport'),
    Strategy = require('passport-twitter').Strategy,
    expressSession = require('express-session'),
    app = express();

const TWITTER_CONSUMER_KEY = 'Po4ZNAfWvEHAr3vuHS1LcNGzP';
const TWITTER_CONSUMER_SECRET = 'R2SCzindQgTviFNr05CviP3GbRDvLedb95N8LZ000KkMCVj225';

passport.use(new Strategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
},
function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
}
));


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

app.get('/login', passport.authenticate('twitter'));

const server = app.listen(3000, function() {

  console.log(`Server is listening on port ${ server.address().port }`)

});

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});


app.get('/tweet', function(req, res){
  res.render('twittertest');
});