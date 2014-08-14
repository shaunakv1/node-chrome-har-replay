var har = require('./sample_har.json')
var http = require('http');
var urlParser = require('url');





// console.log(url.host);
// console.log(url.path);

//ignore server.arcgisonline.com

var totalTime = 0;

function processArrayAsync(items, process) {
    var todo = items.concat();

    setTimeout(function() {
        process(todo.shift());
        if(todo.length > 0) {
            setTimeout(arguments.callee, 25);
        }
    }, 25);
}

var checkPerformance = function(entry){
	var u = entry.request.url;

	if(u.match('noaa.gov')){
		var url = urlParser.parse(u);
		var start = new Date();
		http.get({host: url.host,path: url.path, port: 80}, function(res) {
		    console.log('start : '+ start);
		    console.log('end   : '+ new Date());
		    var end = (new Date() - start)/1000.00;
		    totalTime = totalTime + end;
		    console.log('time  : '+ end , 's');
		    console.log('-----------------------------------------------');
		    
		});
	}
}

processArrayAsync(har.log.entries, checkPerformance);


// console.log("total time: "+ totalTime,'s');
