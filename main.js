var request = require('request');
var moment = require('moment');
var fs = require('fs');
var async = require('async');
var urlParser = require('url');

var copyLogsTo = "L:/httpd/apps/ads/llv-network-performance/logs/"; //mark as null if copying is not needed

function PerformanceTest(options){
    this.options = options;
    this.har = require('./har/'+ options.har);
    this.logFile = './logs/'+ options.log;
    this.avgLogFile = './logs/'+ options.avgLog;
    this.label =   options.label;
    this.stdOut = options.stdOut;

    this.totalTime = 0;
    this.count = 0;
    this.counterCheck = 0;
    this.totalRequests = 0;
    this.successRequests = 0;
    this.startTime = "";
    var THIS = this;
    function runTest(){
        THIS.startTime = moment().format('MMM Do YY, h:mm:ss a');
        async.each(THIS.har.log.entries.reverse(),function(e) {
            if(e.request.url.match('noaa.gov')){
                    THIS.counterCheck = THIS.counterCheck + 1;
                    THIS.totalRequests = THIS.totalRequests + 1;
                    var url = e.request.url;//urlParser.parse(e.request.url);
                    var start = new Date();

                    request(url, function(error,res) {
                        if(res.statusCode == 200)  THIS.successRequests =  THIS.successRequests + 1;
                        /*console.log('start : '+ start);
                        console.log('end   : '+ new Date());*/
                        var end = (new Date() - start)/1000.00;
                        //console.log('time  : '+ end , 's');
                        //console.log('-----------------------------------------------');
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
        if(THIS.stdOut) process.stdout.write("\n"+THIS.label +' :---> '+ THIS.startTime +' :---> ');
        if(THIS.stdOut)  console.log(" time: "+ THIS.totalTime+"s  (req: "+THIS.successRequests+"/"+THIS.totalRequests+")");

        var log = require(THIS.logFile);
        var time = new Date();
        log.push([time, THIS.totalTime]);
        fs.writeFile(THIS.logFile, JSON.stringify(log), function(err) {
                if(err) {
                    console.log(err);
                }
                else{
                    THIS.totalTime = 0;
                    THIS.count = 0;
                    THIS.counterCheck = 0;
                    THIS.successRequests =0;
                    if(copyLogsTo) fs.createReadStream(THIS.logFile).pipe(fs.createWriteStream(copyLogsTo+THIS.options.log));
                }
            });

            var log = require(THIS.avgLogFile);
            log.push([time, THIS.totalTime/THIS.totalRequests]);
            fs.writeFile(THIS.avgLogFile, JSON.stringify(log), function(err) {
                    if(err) {
                        console.log(err);
                    }
                    else{
                        THIS.totalRequests = 0;
                        if(copyLogsTo) fs.createReadStream(THIS.avgLogFile).pipe(fs.createWriteStream(copyLogsTo+THIS.options.avgLog));
                    }
                });
        }

};

/**
 * Run for LLV Production
 */

var opt_llv_p = {
    har:'llv_p_har.json',
    log:'llv_p_log.json',
    avgLog:'llv_p_avg_log.json',
    stdOut:true,
    label:"LLV PR"
};

var opt_llv_qa = {
    har:'llv_qa_har.json',
    log:'llv_qa_log.json',
    avgLog:'llv_qa_avg_log.json',
    stdOut:true,
    label:"LLV QA"
};

var opt_slr_p = {
    har:'slr_p_har.json',
    log:'slr_p_log.json',
    avgLog:'slr_p_avg_log.json',
    stdOut:true,
    label:"SLR PR"
};


//Run LLV Production
new PerformanceTest(opt_llv_p);
setInterval(function() { new PerformanceTest(opt_llv_p); }, 1000 * 60 * 30 );

//Run SLR Production
setTimeout(function() {
      new PerformanceTest(opt_slr_p);
      setInterval(function() { new PerformanceTest(opt_slr_p); }, 1000 * 60 * 30 );
}, 1000 * 60 * 5);

//Run LLV Webqa
// 10 minutes after runing last sequence, start running qa
setTimeout(function() {
      new PerformanceTest(opt_llv_qa);
      setInterval(function() { new PerformanceTest(opt_llv_qa); }, 1000 * 60 * 30 );
}, 1000 * 60 * 10);