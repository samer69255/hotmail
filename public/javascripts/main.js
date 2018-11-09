(function () {
    var ems = document.getElementById('emails');
    var s = document.getElementById('eStat');
    var su = document.getElementById('success');
    ems.addEventListener('paste', function(e) {
    e.preventDefault();
     var  clipboardData = e.clipboardData || window.clipboardData;
    var text = clipboardData.getData('Text');
    var emails = text.split(/\n+/);
    if (emails.length == 0) return;
    var emails2 = [];
    for (var i in emails) {
        var key = emails[key];
        if (key.indexOf("com.ar") > -1) continue;
          if (key.indexOf('@hotmail') > -1 || key.indexOf('@outlook') > -1 || key.indexOf('@live') > -1 )  emails2.push(key);
        }
    this.value = emails2.join('\n').trim();
    });
    
    document.getElementById('ckeck').addEventListener('click', function () {
        var value = ems.value;
        if (value.length < 7) return;
        document.getElementById('main1').className = 'hide'
        document.getElementById('main2').className = '';
        var emails = value.split(/\n+/);
        emails = JSON.stringify({ems:emails});
        
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            s.innerHTML = 'stating';
            start();
        }
        xhr.open('POST', '/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(emails);
        
        
    });
    
    function start() {
        Interval = setInterval(function() {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var text = xhr.responseText;
                var ob = JSON.parse(text);
                
                s.innerHTML = ob.eml;
                console.log(ob);
                su.value = ob.su.join('\n');
                if (ob.len == 0) {
                    clearInterval(Interval);
                    s.innerHTML = 'complte';
                }
            }
            xhr.open('get', '/chk');
            xhr.send();
        },300)
    }
})();
