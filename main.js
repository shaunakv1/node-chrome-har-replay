var queue = require('./lib/testQueue.js');

/**
 * Profiles: Will need refactoring to exttract these into a more managable place
 */

var llv_p = {
    har:'llv_p_har.json',
    log:'llv_p_log.json',
    avgLog:'llv_p_avg_log.json',
    stdOut:true,
    label:"LLV P"
};

var llv_agol = {
    har:'llv_agol_har.json',
    log:'llv_agol_log.json',
    avgLog:'llv_agol_avg_log.json',
    stdOut:true,
    label:"LLV AGOL"
};

var llv_qa = {
    har:'llv_qa_har.json',
    log:'llv_qa_log.json',
    avgLog:'llv_qa_avg_log.json',
    stdOut:true,
    label:"LLV QA"
};

var slr_p = {
    har:'slr_p_har.json',
    log:'slr_p_log.json',
    avgLog:'slr_p_avg_log.json',
    stdOut:true,
    label:"SLR PR"
};
/**
 * Start Testing here..
 */
 queue.setQueueTimeDelay(2000);
 queue.addJob(llv_p);
 queue.addJob(llv_agol);
 queue.addJob(slr_p);
 queue.addJob(llv_qa);

