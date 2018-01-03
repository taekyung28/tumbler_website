
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    user     : 'b3bf751ec2fd4a',
    password : '7e26ecb2',
    database : 'heroku_56bd3a78820e59a'
  });

  function keepalive() {
    conn.query('select 1', [], function(err, result) {
      if(err) return console.log(err);
      // Successul keepalive
    });
  }
  setInterval(keepalive, 1000*60*5);

module.exports = conn;
/*
module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'gksxorud',
    database : 'test'
  });
  conn.connect();

  return conn;
};
*/
