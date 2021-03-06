var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



async function Check(emails) {
    await Init();
    var list = [];
    for (var i=0; i<emails.length; i++) {
        var email = emails[i];
    var isF = await checkF(email);
    if (isF) {
        var isH = await ckeckH(email);
        if (isH) list.push(email);
    }
    console.log(list.length);
    }
    
    console.log(list);
    
   
}


async function checkF(email) {
    
    return new Promise(resolve => {
            requset.post({
        url:'https://m.facebook.com/login/identify/?ctx=recover&search_attempts=1',
        body:'email='+email,
        headers:{'Content-Type':'application/x-www-form-urlencoded',
                 'user-agent':'chrome/android'
                },
    }, (err, response, body) => {
        resolve(response.statusCode == 302);
    });
    });

}





module.exports = app;
