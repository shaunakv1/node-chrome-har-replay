var har = require('./sample_har.json');
var http = require('http');
var fs = require('fs');
var async = require('async');
var urlParser = require('url');


// console.log(url.host);
// console.log(url.path);

//ignore server.arcgisonline.com

var totalTime = 0;
var count = 0;
var counterCheck = 0;

function done (end) {

}

async.each(har.log.entries.reverse(),function(e,done) {
    if(e.request.url.match('noaa.gov')){
            counterCheck = counterCheck + 1;
            var url = urlParser.parse(e.request.url);
            var start = new Date();

            http.get({host: url.host,path: url.path, port: 80}, function(res) {
                //console.log('start : '+ start);
                //console.log('end   : '+ new Date());
                var end = (new Date() - start)/1000.00;
                //console.log('time  : '+ end , 's');
                //console.log('-----------------------------------------------');
                doneRequest(end);
            });
        }
}, function (err) {
    console.log('error..');
    console.log(err);
});

function doneRequest(end){
    totalTime = totalTime + end;
    count = count + 1;

    if(count >= counterCheck){
        console.log("total time: "+ totalTime,'s');
        var log = require('./log.json');
        log.push([new Date(), totalTime]);
        fs.writeFile("./log.json", JSON.stringify(log), function(err) {
                if(err) {
                    console.log(err);
                }
            });
    }
}


