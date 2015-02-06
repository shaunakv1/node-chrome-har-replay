var notifications = require('./notifications.js');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var async = require('async');
var urlParser = require('url');


var copyLogsTo = null;//"L:/httpd/apps/ads/llv-network-performance/logs/"; //mark as null if copying is not needed

var PerformanceTest  = function (options,callbackToTestQueue){
    this.callback = callbackToTestQueue;
    //this.db = options.logToDatabase;
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
                    var end = (new Date() - start)/1000.00;
                    THIS.logRequestTimes(end);
                   }
                   else{
                      if(THIS.stdOut) console.log("Cannot Fetch URL", url);
                      //if(THIS.stdOut) console.log("error:", err);
                      //if(THIS.stdOut) console.log("response: ", res);

                      // report out an unsuccessful request
                      var end = (new Date() - start)/1000.00;
                      THIS.logRequestTimes(end);
                   }
               });
           }
    }, function (err) {
       if(THIS.stdOut) console.log('error..');
       if(THIS.stdOut) console.log(err);
       if(THIS.callback) this.callback(err);
    });
}

PerformanceTest.prototype.logRequestTimes = function (end){
    var THIS = this;
    THIS.totalTime = THIS.totalTime + end;
    THIS.count = THIS.count + 1;
    if(THIS.count >= THIS.counterCheck){
        /*if(THIS.stdOut) process.stdout.write("\n"+THIS.label +' :---> '+ THIS.startTime +' :---> ');
        if(THIS.stdOut)  console.log(" time: "+ THIS.totalTime+"s  (req: "+THIS.successRequests+"/"+THIS.totalRequests+")");*/

        var time = new Date();
        var log = {
            profile: THIS.options.har,
            label: THIS.label,
            timestamp: time,
            avg: THIS.totalTime/THIS.totalRequests,
            total: THIS.totalTime
        }
        var logMessage = "\n"+THIS.label +' :---> '+ THIS.startTime +' :---> ' + " time: "+ THIS.totalTime+"s  (req: "+THIS.successRequests+"/"+THIS.totalRequests+")";

        //Finally when the test result is available, send it back to callback chain
        if(THIS.callback){
          THIS.callback(null,{
            logObject: log,
            logMessage: logMessage
          });
        }
    }
};

/**
 * Takes a input profile object and starts a performance test on it
 * @param  {[object]} profile
 *  var sampleProfile = {
 *     har:'llv_p_har.json',
 *     log:'llv_p_log.json',
 *     avgLog:'llv_p_avg_log.json',
 *     stdOut:true,
 *     label:"LLV P",
 *     logToDatabase: db (instance of database.js)
 *  };
 * @param  {[function]} callback
 */
module.exports = function(profile,callback){
  new PerformanceTest(profile,callback);
}