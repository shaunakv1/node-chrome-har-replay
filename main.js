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
    label:"LLV P"/*,
    logToDatabase:db*/
};

var llv_agol = {
    har:'llv_agol_har.json',
    log:'llv_agol_log.json',
    avgLog:'llv_agol_avg_log.json',
    stdOut:true,
    label:"LLV AGOL"/*,
    logToDatabase:db*/
};

var llv_qa = {
    har:'llv_qa_har.json',
    log:'llv_qa_log.json',
    avgLog:'llv_qa_avg_log.json',
    stdOut:true,
    label:"LLV QA"/*,
    logToDatabase:db*/
};

var slr_p = {
    har:'slr_p_har.json',
    log:'slr_p_log.json',
    avgLog:'slr_p_avg_log.json',
    stdOut:true,
    label:"SLR PR"/*,
    logToDatabase:db*/
};



/*
//Run LLV Production
setInterval(function() { new PerformanceTest(opt_llv_p); }, 1000 * 60 * 15 );

//Run SLR Production
setTimeout(function() {
      new PerformanceTest(opt_slr_p);
      setInterval(function() { new PerformanceTest(opt_slr_p); }, 1000 * 60 * 15 );
}, 1000 * 60 * 5);

//Run LLV Webqa
//10 minutes after runing last sequence, start running qa
setTimeout(function() {
      new PerformanceTest(opt_llv_qa);
      setInterval(function() { new PerformanceTest(opt_llv_qa); }, 1000 * 60 * 15 );
}, 1000 * 60 * 10);

//Run LLV AGOL
//15 minutes after runing last sequence, start running qa
new PerformanceTest(opt_llv_agol);
setTimeout(function() {
      new PerformanceTest(opt_llv_agol);
      setInterval(function() { new PerformanceTest(opt_llv_agol); }, 1000 * 60 * 15 );
}, 1000 * 60 * 15);
*/