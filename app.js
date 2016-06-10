var express = require('express');
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gulp = require('gulp');
var swig = require('swig');
var cons = require('consolidate');
var passwordHash = require('password-hash');
var http = require('http');
var https = require('https');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var routes = require('./routes/index');


var app = express();

//HTTPS Keys
var HTTPS_PORT = 443;
var options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
}

//MySQL Connection
// app.use(
//     connection(mysql,{
//         host: 'localhost',
//         user: 'root',
//         password : 'barcrawl16',
//         port : 3307,
//         database:'barcrawl'
//     },'request')
// );

// view engine setup
app.engine('html', cons.swig);
app.set('view engine', 'html');

swig.setDefaults({ varControls: ['<%=', '%>'] }); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// var unsecServer = http.createServer(app).listen(81, function(){
//   console.log("HTTP Server listen on port 81");
// });

var secServer = https.createServer(options, app).listen(HTTPS_PORT, function(){
  console.log("Secure Server listen on port 443");
});

module.exports = app;