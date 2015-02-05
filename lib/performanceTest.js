var notifications = require('./notifications.js');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var async = require('async');
var urlParser = require('url');
var db = require('./database.js');

var copyLogsTo = null;//"L:/httpd/apps/ads/llv-network-performance/logs/"; //mark as null if copying is not needed

exports.PerformanceTest  = function (options){
    this.options = options;
    this.har = require('../har/'+ options.har);
    this.label =   options.label;
    this.stdOut = options.stdOut;

    this.totalTime = 0;
    this.count = 0;
    this.counterCheck = 0;
    this.totalRequests = 0;
    this.successRequests = 0;
    this.startTime = "";
    var THIS = this;

    console.log("Preforming Test ", this.label);

    THIS.startTime = moment().format('MMM Do YY, h:mm:ss a');
    async.each(THIS.har.log.entries.reverse(),function(e) {
       if(e.request.url.match('noaa.gov') || e.request.url.match('arcgis.com')){
               //if(THIS.label === 'LLV QA') throw new Error('something bad happened');
               THIS.counterCheck = THIS.counterCheck + 1;
               THIS.totalRequests = THIS.totalRequests + 1;
               var url = e.request.url;
               var start = new Date();
               //console.log("request: ", url);
               request(url, function(err,res) {
                   if(res && res.statusCode == 200){
                    THIS.successRequests =  THIS.successRequests + 1;
                    //console.log('start : '+ start);
                    //console.log('end   : '+ new Date());
                    var end = (new Date() - start)/1000.00;
                    //console.log('time  : '+ end , 's');
                    //console.log('-----------------------------------------------');
                    THIS.logRequestTimes(end);
                   }
                   else{
                    if(THIS.stdOut) console.log("Cannot Fetch URL", url);
                    //if(THIS.stdOut) console.log("error:", err);
                    //if(THIS.stdOut) console.log("response: ", res);
                   }
               });
           }
    }, function (err) {
       if(THIS.stdOut) console.log('error..');
       if(THIS.stdOut) console.log(err);
    });
}

exports.PerformanceTest.prototype.logRequestTimes = function (end){
    var THIS = this;
    THIS.totalTime = THIS.totalTime + end;
    THIS.count = THIS.count + 1;
    if(THIS.count >= THIS.counterCheck){
        if(THIS.stdOut) process.stdout.write("\n"+THIS.label +' :---> '+ THIS.startTime +' :---> ');
        if(THIS.stdOut)  console.log(" time: "+ THIS.totalTime+"s  (req: "+THIS.successRequests+"/"+THIS.totalRequests+")");

        var time = new Date();
        var log = {
            profile: THIS.options.har,
            label: THIS.label,
            timestamp: time,
            avg: THIS.totalTime/THIS.totalRequests,
            total: THIS.totalTime
        }

        db.getDatabase().insert(log, function (err, newDoc) {
            if(THIS.stdOut) console.log("Log Written");
        });
    }
};