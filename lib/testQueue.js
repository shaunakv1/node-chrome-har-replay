/**
 * This is a task runner. It will take the function to run
 * and add it in the execute queue. The queue will keep executing
 * after specific time interval.
 */

var workerFarm = require('worker-farm')
var performanceDB = require('./database.js');

//Initialize a database once.
performanceDB.initialize(function (err,loadeddb){
  performanceDB  = loadeddb;
},true);

var jobQueue = [];
var jobDelay = 2000;// default time in milliseconds

/**
 * Defines worker
 */
// API here: https://github.com/rvagg/node-worker-farm
// Might have to explore other optins like 'maxConcurrentCallsPerWorker'
var workOn = workerFarm({maxRetries:1},require.resolve('./performanceTest.js'));

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
		//spawn workers to measure performance of the service
		workOn(job,function(err,result){
			//write the results to the database here once the test is done..
			if(err) console.log(err);

			if(result){
				if(performanceDB) performanceDB.insert(result.logObject, function (err, newRecord) {
				    console.log(result.logMessage)
				    console.log("Log Written");
				    console.log("--------Job Done-----------")
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


exports.setQueueTimeDelay = function (timeDelayInMilliSeconds) {
	jobDelay = timeDelayInMilliSeconds;
}


