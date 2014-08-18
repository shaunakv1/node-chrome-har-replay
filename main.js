var har = require('./llv_har2.json');
var http = require('http');
var fs = require('fs');
var async = require('async');
var urlParser = require('url');


function PerformanceTest(){
    this.totalTime = 0;
    this.count = 0;
    this.counterCheck = 0;
    var THIS = this;
    function runTest(){
        process.stdout.write('running test at:'+ new Date());
        async.each(har.log.entries.reverse(),function(e) {
            if(e.request.url.match('noaa.gov')){
                    THIS.counterCheck = THIS.counterCheck + 1;
                    var url = urlParser.parse(e.request.url);
                    var start = new Date();

                    http.get({host: url.host,path: url.path, port: 80}, function(res) {
                        console.log('start : '+ start);
                        console.log('end   : '+ new Date());
                        var end = (new Date() - start)/1000.00;
                        console.log('time  : '+ end , 's');
                        console.log('-----------------------------------------------');
                        THIS.doneRequest(end);
                    });
                }
        }, function (err) {
            console.log('error..');
            console.log(err);
        });
    }

    runTest();
}

PerformanceTest.prototype.doneRequest = function (end){
    var THIS = this;
    THIS.totalTime = THIS.totalTime + end;
    THIS.count = THIS.count + 1;
    if(THIS.count >= THIS.counterCheck){
        console.log("...done...total time: "+ THIS.totalTime+"s");
        var log = require('./log.json');
        log.push([new Date(), THIS.totalTime]);
        fs.writeFile("./log.json", JSON.stringify(log), function(err) {
                if(err) {
                    console.log(err);
                }
                else{
                    THIS.totalTime = 0;
                    THIS.count = 0;
                    THIS.counterCheck = 0;
                }
            });
    }

};

new PerformanceTest();
setInterval(function() { new PerformanceTest(); }, 1000 * 60 * 30 );

