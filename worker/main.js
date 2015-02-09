var queue = require('./lib/testQueue.js');
var fileWatcher = require('watchr');
var validator = require('validator');
var fs = require('fs');

/**
 * [profilesArray Takes and array of object of the form]
 * {
 *     har:'slr_p_har.json',
 *     stdOut:true,
 *     label:"SLR PR"
 * };
 */

var profilesArray = [];
var testRunnerDeamon;

/**
 * [generateProfilesFromFileList Takes a array of fileName strings, and pushes
 * profile objects in the profiles Array]
 * @param  {[type]} fileList [description]
 */
function generateProfilesFromFileList(fileList){
    fileList.forEach(function(fileName){
        if(thisfileIsValidJSON(fileName))
            profilesArray.push({
                har: fileName,
                stdOut:true,
                label: fileName.replace('.json','')
            });
    });
    //console.log(profilesArray);
}

function startPerformanceTester(){
    console.log("Beginning Performance Tester Demon");

    //queue them all
    queueAllProfiles();

    //queue again every 1 hour
    testRunnerDeamon = setInterval(function () {
        queueAllProfiles();
    },1000 * 60 * 1); // 5 min
}

function queueAllProfiles(){
    console.log('Queuing up all available profiles');
    //1 mins delay between running each profiles
    //queue.setQueueTimeDelay(1000 * 60 * 1);
    profilesArray.forEach(function(profile){
        queue.addJob(profile);
    });
}

/**
 * Starts a file watcher on har directory. At the begining picks up any HAR profiles
 * available, and generates profiles from the file list.Then it begins the PerformanceTester()
 *
 * It then keeps watching for new changes to the har directory and
 * if new files are detected, adds them generateProfilesFromFileList() too.
 */

fileWatcher.watch({
    path:'./har',
    listeners: {
          error: function(err){
              console.log('Could not read HAR Directory', err);
          },
          watching: function(err,watcherInstance,isWatching){
              if (err) {
                  console.log("Could not Watch HAR Directory" + watcherInstance.path + " failed with error", err);
              } else {
                  console.log("watching the path " + watcherInstance.path + " completed");
                  generateProfilesFromFileList(Object.keys(watcherInstance.children));
                  startPerformanceTester();
              }
          },
          change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
              console.log('Har folder was changed');
              //stop the PerformaceTester
              clearInterval(testRunnerDeamon);
              //and requeue the jobs
              generateProfilesFromFileList(fs.readdirSync('./har'));
              startPerformanceTester();
          }
      }
});


function thisfileIsValidJSON(fileName){
    console.log("Validate " + fileName +" :"+ validator.isJSON(fs.readFileSync('./har/'+fileName)));
    return validator.isJSON(fs.readFileSync('./har/'+fileName));
}