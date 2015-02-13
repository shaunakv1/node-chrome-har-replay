'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('harPerformanceMonitor.services', [])
  .factory('_',[function() {
     return window._; // assumes underscore has already been loaded on the page
  }])
  
  .factory('profilePerformanceService', ['$http', function($http) {
     return {
       get: function (profileID) {
         return $http.jsonp(config.domain+'/getPerformanceProfile?profile='+profileID+'&callback=JSON_CALLBACK').then(function(res) {
                    var log = res.data;
                    log = log.data.map(function(log){
                      // parse date, and offset values to series is visible
                      return [Date.parse(log.timestamp), log.avg];
                    });
                    return log;
                });
       }
     };
  }])

  .factory('profielListService', ['$http',function($http) {
     return {
       get: function () {
           return $http.jsonp(config.domain+'/getAllProfiles?callback=JSON_CALLBACK').then(function(res) {
              return res.data.data.map(function (p) {
                return {name: p, id:p};
           });
      });
       }
     };
  }]);


  /*function parseDmzLogs(log,weeks){
  log = JSON.parse("["+ log.trim().slice(0, - 1) + "]");

  var currentDate = new Date();
  var checkDate = new Date(currentDate.setDate(currentDate.getDate() - weeks * 7 ));

  var filteredLog = _.reject(log, function(entry){
    var entryDate = new Date(Date.parse(entry[0]));
      return entryDate < checkDate;
  });

  logLatency = filteredLog.map(function(val){ return [val[0],val[3]];});
  logReads = filteredLog.map(function(val){ return [val[0],val[1]];});
  logWrites = filteredLog.map(function(val){ return [val[0],val[2]];});

  return [logReads,logWrites,logLatency];
}*/