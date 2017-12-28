var express = require('express');
var router = express.Router();
var conn = require('../config/db')();


router.get('/', function(req, res) {
    if(req.user && req.user.id){
        var userid = req.user.id
        var sql = 'SELECT count(*) as cnt FROM use_count where user_id=?';
        conn.query(sql, userid, function(err,results){
          res.render('index.ejs',{
            hello : `hello ${req.user.username}`,
            result : results[0],
            user : req.user
          });
          console.log(results)
        });

    } else {
      var sql = 'SELECT count(*) as cnt FROM use_count';
      conn.query(sql, function(err,results){
        res.render('index.ejs',{
          hello : 'WELCOME stranger',
          result : results[0],
          user : req.user
        });
        console.log(results);
      });
    }
});


router.post('/', function(req, res){
    var user_id = req.user.id;
    var sql = 'INSERT INTO use_count(user_id,usercount,usertime) values(?,1,NOW())';
    conn.query(sql, user_id, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        console.log(results);
        res.redirect('/index');
      }
    });
});


module.exports = router;
