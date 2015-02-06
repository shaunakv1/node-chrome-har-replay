/**
 * This is just a task runner. It will take the function to run
 * and add it in the execute queue. The queue will keep executing
 * after specific time interval.
 */

var jobQueue = [];
var jobDelay = 2000;// time in milliseconds

/**
 * This recursive function execxutes the jobs one by one with a delay between each of them
 * @return {[array]} This is array of jobs to execute
 */
function processQueue(jobs){
	if(jobs.length < 1) return;

	//execute jobs every jobDelay milliseconds
	setTimeout(function(){
		var job = jobs.shift();
		// replace this with background worker using
		//https://github.com/rvagg/node-worker-farm
		job();
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


