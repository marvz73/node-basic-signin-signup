var express = require('express');
var router = express.Router();
var models  = require('../models');
var uuid = require('node-uuid');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'h3j5fcd35';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = function(passport) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { 
            user : req.user, // get the user out of session and pass to template
            title: 'Express' 
        });
    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    router.get('/signin', loggedIn, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signin', { message: req.flash('signinMessage') }); 
    });

    // // process the login form
    router.post('/signin', loggedIn, passport.authenticate('local-signin', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    router.get('/signup', loggedIn, function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') }); 
    });

    // // process the signup form
    router.post('/signup', 
        loggedIn,
        function(req, res){

            var passwordHash = encrypt(req.body.password); //password encryption
            var token = uuid.v4(); //token generation

            //create user
            models.User
                .findOrCreate({
                    where: {
                        email: req.body.email
                    }, 
                    defaults: {
                        firstName: req.body.fname,
                        lastName: req.body.lname,
                        password: passwordHash,
                        token: token
                    }
                })
                .spread(function(user, isCreated) {
                    if(isCreated){
                        res.render('signup', { message: 'Successfully registered.' });
                    }else{
                        res.render('signup', { message: 'Email already exist.' });
                    } 
                })
        }

    );

    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    router.get('/profile', isLoggedIn, function(req, res) {
    	res.render('profile', {
    	    user : req.user // get the user out of session and pass to template
    	});
    });

    return router;

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

}

// route middleware to make sure a user is logged in
function loggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

}
