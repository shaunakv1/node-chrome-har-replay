var express = require('express');
var http = require('http');
var performanceDB = require('../worker/lib/database.js');

/**
 * Initialize Express Web Server
 */
var app = express();
var server = http.createServer(app);
app.set("jsonp callback", true);

/**
 * Web Service 1: getPerformance Profile
 * Get Parameters
 * profile=profileHarFile
 *
 * sample url
 * /getPerformanceProfile?profile = llv_agol_har.json
 */

app.get('/getPerformanceProfile', function(req, res) {
  var p = req.query.profile;
  res.setTimeout(0);

  performanceDB.initialize(function(err,db){
    if(!err){
      db.find({ profile: p }).sort({ timestamp: 1 }).exec(function (err, documents) {
        res.jsonp({
            err:err,
            length:documents.length ,
            data:documents
        });
      });
    }
    else{
       res.jsonp({
            err:err
        });
    }
  });

});//finish app.get

server.listen(4731);
console.log('Server listening on port 4731');