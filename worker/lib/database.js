'use strict';

var Datastore = require('nedb');
var Logger = require('nedb-logger')
var performanceDBFile = 'db/performance-logs.json';
var performanceDB;
exports.initialize = function(onDBInitialized,loggingModeOnly) {
    //when in logging mode, use neeb-logger library, so whole DB is not loaded in memory
    if(!loggingModeOnly){
            // Initialize the Flat File Database
            performanceDB = new Datastore({ filename: performanceDBFile, autoload: false });

            //report database loaded
            performanceDB.loadDatabase(function (err) {
                console.log("Database Initialized Successfully");
                onDBInitialized = onDBInitialized || function () {};
                onDBInitialized(err,performanceDB);
            });

            //Apply Index
            performanceDB.ensureIndex({ fieldName: 'profile', unique: false }, function (err) {
                if(err !== null ) console.log(err);
            });
    }
    else{
        performanceDB = new Logger({ filename: performanceDBFile });
        console.log("Database Initialized In Logging Mode Successfully");
        onDBInitialized = onDBInitialized || function () {};
        onDBInitialized(null,performanceDB);
    }
}

exports.getDatabase = function() {
	return performanceDB;
}