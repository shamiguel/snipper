var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

var router = express.Router();
const users = []; 

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
  }, function verify(issuer, profile, cb) {
    console.log(profile)
  }));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, email: user.email});
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

  router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
module.exports = router;