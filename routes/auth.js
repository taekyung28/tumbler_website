module.exports = function(passport){
  var express = require('express');
  var router = express.Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../config/db');


  // /auth/login
  router.get('/login', function(req, res) {
    res.render('login.ejs');
  });

  router.post('/login',
    passport.authenticate('local', { successRedirect: '/index',
                                     failureRedirect: '/auth/login',
                                     failureFlash: false
    })
  );

  // /auth/logout
  router.get('/logout',function(req,res){
    req.logout();
    req.session.save(function(){
      res.redirect('/index');
    });
  });


  // /auth/signup
  router.post('/signup', function(req, res){
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('gender', 'gender field cannot be empty.').notEmpty();
    req.checkBody('birthyear', 'birthyear field cannot be empty.').notEmpty();
    //req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    //req.checkBody("password", "Password must include one lowercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

    const valError = req.validationErrors();
    if(valError){
      console.log(`errors: ${JSON.stringify(valError)}`);
      res.render('signup',{
        errors: valError
      });
    } else {
      hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
          authId: 'local:'+req.body.username,
          username: req.body.username,
          password: hash,
          salt: salt,
          email: req.body.email,
          gender: req.body.gender,
          birthyear: req.body.birthyear
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err, results){
          if(err){
            console.log(err);
            res.render('signup',{
              errors: err
            });
          } else {
            req.login(user, function(err){
              req.session.save(function(){
                res.redirect('/index');
              });
            });
          }
        });
      });
    }


  });

  router.get('/signup', function(req, res) {
    res.render('signup.ejs',{
      errors:''
    });
  });

  return router;
};
