var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
const cors = require('cors');

var indexRouter = require('./routes/index');
var users = require('./routes/users');
var ngoblogs = require('./routes/ngoblogs');
var ngobeneficiary = require('./routes/ngobeneficiary');
var donorspeaks = require('./routes/donorspeaks');
var medicines = require('./routes/medicines');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Users = require('./models/user');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connect.then(
  (db) => {
    console.log('Connected correctly to the server');
  },
  (err) => {
    console.log(err);
  }
);

var app = express();

// cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/ngoblogs', ngoblogs);
app.use('/ngobeneficiary', ngobeneficiary);
app.use('/donorspeaks', donorspeaks);
app.use('/medicines', medicines);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
