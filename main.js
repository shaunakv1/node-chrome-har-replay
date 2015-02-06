var db = require('./lib/database.js');
var test = require('./lib/performanceTest.js');
var queue = require('./lib/testQueue.js');

/**
 * Start by initializing the database, then in the call back keep running
 * the preformance test on different profiles
 */
db.initialize(function (err,performanceDB) {
    if(!err){
        console.log("Database Initialized Successfully");
        /**
         * Start Testing here..
         */
         queue.setQueueTimeDelay(2000);
         queue.addJob(llv_p);
         queue.addJob(llv_agol);
         queue.addJob(slr_p);
         queue.addJob(llv_qa);
    }
    else{
        notifications.error(err);
    }
});


/**
 * Profiles: Will need refactoring to exttract these into a more managable place
 */

var llv_p = {
    har:'llv_p_har.json',
    log:'llv_p_log.json',
    avgLog:'llv_p_avg_log.json',
    stdOut:true,
    label:"LLV P",
    logToDatabase:db
};

var llv_agol = {
    har:'llv_agol_har.json',
    log:'llv_agol_log.json',
    avgLog:'llv_agol_avg_log.json',
    stdOut:true,
    label:"LLV AGOL",
    logToDatabase:db
};

var llv_qa = {
    har:'llv_qa_har.json',
    log:'llv_qa_log.json',
    avgLog:'llv_qa_avg_log.json',
    stdOut:true,
    label:"LLV QA",
    logToDatabase:db
};

var slr_p = {
    har:'slr_p_har.json',
    log:'slr_p_log.json',
    avgLog:'slr_p_avg_log.json',
    stdOut:true,
    label:"SLR PR",
    logToDatabase:db
};