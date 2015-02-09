/**
 * This is a task runner. It will take the function to run
 * and add it in the execute queue. The queue will keep executing
 * after specific time interval.
 */

/**
 * Defines worker
 * API here: https://github.com/rvagg/node-worker-farm
 */
var workerFarm = require('worker-farm')
var performanceTestWorker = workerFarm({maxRetries:1},require.resolve('./performanceTest.js'));

/**
 * Initialize a database.
 */
var performanceDB = require('./database.js');
performanceDB.initialize(function (err,loadeddb){
  performanceDB  = loadeddb;
},true);

/**
 * Initialize empty job Queue
 * @type {Array}
 */
var jobQueue = [];
var jobDelay = 2000;// default time in milliseconds


/**
 * [processQueue This recursive function execxutes the jobs one by one with a delay between each of them]
 * @param  {[object]} jobs [array of job object that describe the configuration of the job to be executed]
 */

function processQueue(jobs){
	if(jobs.length < 1){
      //release farm
      workerFarm.end(performanceTestWorker);
      //setup for next round
      performanceTestWorker = workerFarm({maxRetries:1},require.resolve('./performanceTest.js'));

      return;
	}

	//execute jobs every jobDelay milliseconds
	setTimeout(function(){
		var job = jobs.shift();
		//spawn workers to measure performance of the service
		performanceTestWorker(job,function(err,result){
			//write the results to the database here once the test is done..
			if(err) console.log(err);

			if(result){
				if(performanceDB) performanceDB.insert(result.logObject, function (err, newRecord) {
				    console.log(result.logMessage)
				    console.log("Log Written");
				    console.log("--------Job Done-----------\n\n")
				});
				else{
					console.log(new Error("Database not available. Just writing Log"));
					console.log(result.logMessage);
				}

			}
		});
		processQueue(jobs);
	},jobDelay);
}

/**
 * Takes a job (function) and adds it to jobQueue.
 * The watch in the initialize, keeps an eye on the queue
 * and as soon as it detects the jobs, starts processing them
 *
 * @param {[function]} job Pass a function to execute in a queue
 */

exports.addJob = function(job) {
	jobQueue.push(job);

	if(jobQueue.length == 1){
		console.log('\n\n\n\nBeginning Queue Processing at', new Date() );
		processQueue(jobQueue);
	}
};

/**
 * This function returns information all the active jobs and their progress information
 */
exports.getActiveJobs = function(){

}

/**
 * Overides the time delay between each job execution in queue
 * @param {[intger]} timeDelayInMilliSeconds dealy in milliseconds
 */
exports.setQueueTimeDelay = function (timeDelayInMilliSeconds) {
	jobDelay = timeDelayInMilliSeconds;
}


