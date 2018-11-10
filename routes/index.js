var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');
var requset = require('request');

var unescapeJs = require("unescape-js");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async function(req, res, next) {
 ss = {}
         cookie = "";
         su = {ems:[], u:0, f:0, t:0, len:0};
         eml = "working";
    
console.log(req.body);
    ems = req.body.ems;
    su.len = ems.length;
    res.end('');
    await Init();
    for (var i in ems) {
        var key = ems[i];
        eml = key;
        await time(dd);
        var ch = await ckeckH(key);
        console.log(key + ' => '+ ch);
        if (ch == 'error1')
            {
                await(2000);
                await Init();
                i + i - 1;
                continue;
            }
        if (ch == true) {su.ems.push(eml);
            su.t++;  
        }
        else if (ch == false) {  su.f++; }
        else su.u++;
    }
    ems = [];
    
});

router.get('/chk', function(req, res) {
        res.end(JSON.stringify({su:su,len:ems.length, eml:eml}));
        //console.log(su);
        });

function Init() {
    return new Promise(resolve => {
        
        
        
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
    
   var res = await fetch('https://signup.live.com/API/CheckAvailableSigninNames?lic=1', options)
   .catch(err => {
      return ckeckH(email);
   });
   if (res.status != '200') {console.log('error 1');  return 'error1' };
   var json = await res.json().catch(e => {
       console.log('error 2');
       json = {}
   });
    // console.log(res.status);
//    if (json.isAvailable == undefined) console.log(json, email);
//    if (json.error) {
//        
//    }
     if (json.apiCanary)
     ss.canary = json.apiCanary;
     return json.isAvailable;
}

async function time(dd) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        },dd);
    });
}


module.exports = router;
