const express = require('express');
const app = express();
var session = require('express-session');
const bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var expressValidator = require('express-validator');


const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(session({
  secret: 'dnelakjse!2kj2315',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    user     : 'b3bf751ec2fd4a',
    password : '7e26ecb2',
    database : 'heroku_56bd3a78820e59a'
  })
}));


var passport = require('./config/passport')(app);

var auth = require('./routes/auth')(passport);
var index = require('./routes/index.js');
var statistics = require('./routes/statistics');
app.use('/auth', auth);
app.use('/index', index);
app.use('/statistics', statistics);

app.get('*', function(req, res){
  res.send('NOT SERVER');
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);

});
