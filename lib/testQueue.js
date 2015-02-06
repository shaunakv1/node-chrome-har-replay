/**
 * This is just a task runner. It will take the function to run
 * and add it in the execute queue. The queue will keep executing
 * after specific time interval.
 */
var workerFarm = require('worker-farm')

var jobQueue = [];
var jobDelay = 2000;// time in milliseconds


/**
 * Defines worker
 */
// API here: https://github.com/rvagg/node-worker-farm
// Might have to explore other optins like 'maxConcurrentCallsPerWorker'
var workOn = workerFarm({maxRetries:3},require.resolve('./performanceTest.js'));

/**
 * This recursive function execxutes the jobs one by one with a delay between each of them
 * @return {[array]} This is array of jobs to execute
 */
function processQueue(jobs){
	if(jobs.length < 1){
      workerFarm.end(workOn)
      return;
	}

	//execute jobs every jobDelay milliseconds
	setTimeout(function(){
		var job = jobs.shift();
		//spawn workers to measure performance of the database
		workOn(job,function(err,result){
			if(err) console.log(err);
			if(result) console.log(result.logMessage);
			console.log("--------Job Done-----------")
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
		console.log('Beginning Queue Processing');
		processQueue(jobQueue);
	}
};


exports.setQueueTimeDelay = function (timeDelayInMilliSeconds) {
	jobDelay = timeDelayInMilliSeconds;
}


