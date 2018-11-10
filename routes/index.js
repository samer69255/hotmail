var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');
var request = require('request');

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
        await time(1000);
        try {
            var ch = await ckeckH(key);
        } catch (e) {
            throw e;
        }
        console.log(key + ' => '+ ch);
        if (ch == 'error')
            {
                await(2000);
                try {
                    await Init();
                } catch (e) {
                    throw e;
                }
                i = i - 1;
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
        
        
        request.get('https://signup.live.com/?lic=1', (err, respone, body) => {
            if (err) {
                console.log('initing ...');
                return Init();  };
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
    
    var Cookies = respone.headers['set-cookie'];
    Cookies.forEach(key => {
        var cc = key.split(' ')[0];
        cookie += " " + cc;
    });
    cookie = cookie.trim();
    //console.log(cookie);
    resolve();
        });
        

    });

}


async function ckeckH(email) {
    
    return new Promise(resolve => {
          var data = {signInName:email,uaid:ss.uaid,includeSuggestions:true,uiflvr:ss.uiflvr,scid:ss.scid,hpgid:ss.hpgid}
   // console.log(data);
    var options = {
    url:'https://signup.live.com/API/CheckAvailableSigninNames?lic=1',
    json:(data),
    headers:{
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':cookie,
        'canary':ss.canary
}
}
    
    request.post(options, (err, response, body) => {
        if (err) {
            
            return resolve('int');
        }
        if (response.statusCode != '200') return resovle('error');
        if (body.apiCanary)
     ss.canary = body.apiCanary;
      resolve(body.isAvailable);
      console.log(body);
    });
     
    });
  
}

async function time(dd) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        },dd);
    });
}


module.exports = router;
