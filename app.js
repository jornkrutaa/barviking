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

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// MySQL Connection
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306,
        database:'barviking'
    },'request')
);

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


app.get('/', function(req, res) {
    res.render('index.html');
});

/*
app.get('/countries', routes.countries.list);
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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


module.exports = app;