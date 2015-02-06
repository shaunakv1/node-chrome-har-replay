'use strict';

var Datastore = require('nedb');

var performanceDB;

exports.initialize = function(onDBInitialized) {
    // Initialize the Flat File Database
    performanceDB = new Datastore({ filename: 'db/performance-logs.json', autoload: true });

    //report database loaded
    performanceDB.loadDatabase(function (err) {
        onDBInitialized =onDBInitialized || function () {};
        onDBInitialized(err,performanceDB);
    });

    //Apply Index
	performanceDB.ensureIndex({ fieldName: 'profile', unique: false }, function (err) {
	    if(err !== null ) console.log(err);
	});
}

exports.getDatabase = function() {
	return performanceDB;
}