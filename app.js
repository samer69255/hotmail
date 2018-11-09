var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fetch = require('node-fetch');

var app = express();
var requset = require('request');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var unescapeJs = require("unescape-js");
var ss = {}
var cookie = "";
var ems = [];
var su = [];
var eml = "working";

app.post('/', async function(req, res) {
    console.log(req.body);
    if (ems.length > 1) ems = [];
    ems = req.body.ems;
    res.end('');
    await Init();
    for (var i in ems) {
        var key = ems[i];
        eml = key;
        var ch = await ckeckH(key);
        console.log(ch);
        if (ch == true) su.push(eml);
    }
    ems = [];
    
    
});

app.get('/chk', function(req, res) {
        res.end(JSON.stringify({su:su,len:ems.length, eml:eml}));
        //console.log(su);
        })
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


function Init() {
    return new Promise(resolve => {
        
         ss = {}
         cookie = "";
         su = [];
         eml = "working";
        
        fetch('https://signup.live.com/?lic=1')
        .then(res => {
            res.text()
            .then(body => {
                    console.log('working');
    var uaid = body.match(/"uaid":"(.*?)"/)[1],
        uiflvr = body.match(/"uiflvr":(\d+)/)[1],
        scid = body.match(/"scid":(\d+)/)[1],
        hpgid = body.match(/"hpgid":(\d+)/)[1],
        canary = (body.match(/"apiCanary":"(.*?)"/)[1]);
    
    ss = {
        uaid:uaid,
        uiflvr:uiflvr,
        scid:scid,
        hpgid:hpgid,
        canary:unescapeJs(canary)
    }
    
    var Cookies = res.headers.get('set-cookie');
    if (typeof Cookies == 'string') Cookies = [Cookies];
    Cookies.forEach(key => {
        var cc = key.split(' ')[0];
        cookie += " " + cc;
    });
    cookie = cookie.trim();
    //console.log(cookie);
    resolve();
            });
        });
        
//            requset.get('https://signup.live.com/?lic=1', (err, response, body) => {
//});

    });

}


async function ckeckH(email) {
    var data = {signInName:email,uaid:ss.uaid,includeSuggestions:true,uiflvr:ss.uiflvr,scid:ss.scid,hpgid:ss.hpgid}
   // console.log(data);
    var options = {
    method:"POST",
    body:JSON.stringify(data),
    headers:{
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':cookie,
        'canary':ss.canary
}
}
    
   var res = await fetch('https://signup.live.com/API/CheckAvailableSigninNames?lic=1', options);
   var json = await res.json();
     //console.log(json);
    
     ss.canary = json.apiCanary || json.telemetryContext;
    
     return json.isAvailable;
}

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
