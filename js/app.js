$(function () {
        $('#chart').height($("body").height() - 200);
        $.when(
            $.getJSON('logs/llv_p_log.json'),
            $.getJSON('logs/llv_p_avg_log.json'),
            $.getJSON('logs/slr_p_log.json'),
            $.getJSON('logs/slr_p_avg_log.json'),
            $.getJSON('logs/llv_qa_log.json'),
            $.getJSON('logs/llv_qa_avg_log.json')
        ).then(function(log, avg, llvQaLog, llvQaAvgLog ,slrLog, slrAvg) {
              log = log[0];
              avg = avg[0];

              llvQaLog = llvQaLog[0];
              llvQaAvgLog = llvQaAvgLog [0];

              slrLog = slrLog[0];
              slrAvg = _.map(slrAvg[0],function(v){ return [v[0],v[1]+200]; }); // offset slr average by 200 so it is visible

               [log, avg, slrLog, slrAvg,llvQaLog,llvQaAvgLog].forEach(function(arr){
                    arr.forEach(function (v) {
                        v[0] = Date.parse(v[0]);
                    });
               });

               $('#chart').highcharts({
                   chart: {
                       type: 'spline',
                       zoomType: 'x'
                   },
                   plotOptions: {
                       series: {
                           marker: {
                               enabled: false
                           },
                           states: {
                                   hover: {
                                       enabled: false,
                                       lineWidth: null
                                   }
                               }
                       }
                   },
                   title: {
                       text: 'LLV Map Services Network Performance'
                   },
                   subtitle: {
                       text: 'ArcGIS Cache services'
                   },
                   xAxis: {
                       type: 'datetime',
                       tickInterval: 1000 * 60 * 60 * 6,

                      min: log[0][0],
                      max: log[log.length -1 ][0],
                      dateTimeLabelFormats : {
                              hour: '%I %p',
                              minute: '%I:%M %p'
                        }
                   },
                   yAxis: {
                       title: {
                           text: 'Total Response Time (secs)'
                       },
                       min: 0,
                       /*max: 25000*/

                   },
                   /*tooltip: {
                       headerFormat: '<b>{series.name}</b><br>',
                       pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                   },*/

                   series: [{
                       name: 'LLV Total Time',
                       data: log
                   },{
                       name: 'LLV Average Time',
                       data: avg
                   },{
                       name: 'SLR Total Time',
                       data: slrLog
                   },{
                       name: 'SLR Average Time',
                       data: slrAvg
                   },{
                       name: 'LLV QA Total Time',
                       data: llvQaLog
                   },{
                       name: 'LLV QA Average Time',
                       data: llvQaAvgLog
                   }]
               });
        });
});