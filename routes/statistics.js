var express = require('express');
var router = express.Router();
var conn = require('../config/db')();

var chartinfo = function (req, res, next) {
  var sql = 'SELECT count(*) as usercount, DATE_FORMAT(usertime,"%Y-%m-%d") as usertime FROM use_count group by DATE_FORMAT(usertime,"%Y-%m-%d") order by usertime limit 10';
  conn.query(sql, function(err, results){
    var usercount=[results[0].usercount];
    var usertime=[results[0].usertime];
    for (let i=1;i<results.length;i++){
        usercount[i]=results[i].usercount+usercount[i-1];
        usertime.push(results[i].usertime);
    }
    req.usercount = usercount;
    req.usertime = usertime;
  });

  var sql2 = 'select gender, count(*) cnt from use_count group by gender';
  conn.query(sql2, function(err, results){
    var gender=[results[0].cnt,results[1].cnt];
    req.gender= gender;
  });

  next();
};

router.use(chartinfo);


router.get('/', function(req, res) {
    if(req.user && req.user.id){
      var userid = req.user.id
      var sql = 'SELECT count(*) as usercount, DATE_FORMAT(usertime,"%Y-%m-%d") as usertime FROM use_count where user_id=? group by DATE_FORMAT(usertime,"%Y-%m-%d") order by usertime ';
      conn.query(sql, userid, function(err,results){
        res.render('statistics.ejs',{
          hello : `hello ${req.user.username}`,
          result : results,
          user : req.user,
          labels: req.usertime,
          data: req.usercount,
          gender: req.gender
        });
        console.log(results)
      });

    } else {
      var sql = 'SELECT count(*) as usercount, DATE_FORMAT(usertime,"%Y-%m-%d") as usertime FROM use_count group by DATE_FORMAT(usertime,"%Y-%m-%d") order by usertime limit 10';
      conn.query(sql, function(err, results){
        res.render('statistics.ejs',{
          hello : 'WELCOME stranger',
          result : results,
          user : req.user,
          labels: req.usertime,
          data: req.usercount,
          gender: req.gender
        });
        console.log(results)

      });
    };
});


module.exports = router;
