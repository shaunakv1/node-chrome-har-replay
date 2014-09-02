$(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#chart').height($("body").height() - 200);
        $.when(
            $.getJSON('logs/llv_p_log.json'),
            $.getJSON('logs/llv_p_avg_log.json'),
            $.getJSON('logs/slr_p_log.json'),
            $.getJSON('logs/slr_p_avg_log.json'),
            $.getJSON('logs/llv_qa_log.json'),
            $.getJSON('logs/llv_qa_avg_log.json'),
            $.get('logs/san1-dmz-latency.log')
        ).then(function(log, avg, llvQaLog, llvQaAvgLog ,slrLog, slrAvg, dmzLatencyLog) {

              dmzLog = parseDmzLogs(dmzLatencyLog[0]);

              dmzReadsLog = dmzLog[0];
              dmzWritesLog = dmzLog[1];
              dmzLatencyLog = dmzLog[2];

              log = log[0];
              avg = avg[0];

              llvQaLog = llvQaLog[0];
              llvQaAvgLog = _.map(llvQaAvgLog[0],function(v){ return [v[0],v[1]+100]; }); // offset slr average by 200 so it is visible

              slrLog = slrLog[0];
              slrAvg = _.map(slrAvg[0],function(v){ return [v[0],v[1]+200]; }); // offset slr average by 200 so it is visible

               [dmzReadsLog, dmzWritesLog, dmzLatencyLog,log, avg, slrLog, slrAvg,llvQaLog,llvQaAvgLog].forEach(function(arr){
                    arr.forEach(function (v) {
                        v[0] = Date.parse(v[0]);
                    });
               });

               $('#chart').highcharts('StockChart',{
                   chart: {
                       type: 'spline',
                       zoomType: 'x'
                   },
                   legend: {
                        enabled: true,
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

                     /* min: log[0][0],
                      max: log[log.length -1 ][0],*/
                      dateTimeLabelFormats : {
                              hour: '%I:%M %p',
                              minute: '%i:%M %p'
                        }
                   },
                   yAxis: [{ // first Y axis
                             title: {
                                 text: 'Total Response Time (secs)'
                             },
                             min: 0,
                             opposite: false
                             /*max: 25000*/

                            },
                            {  // second Y axis
                              title: {
                                  text: 'DMZ Latency (milli secs)'
                              },
                              opposite: true
                            },{  // third Y axis
                              title: {
                                  text: 'DMZ Read Writes (count)'
                              },
                              opposite: true
                            }],

                   series: [{
                       name: 'LLV Total Time',
                       data: log,
                       visible:false
                   },{
                       name: 'LLV Average Time',
                       data: avg
                   },{
                       name: 'SLR Total Time',
                       data: slrLog,
                       visible:false
                   },{
                       name: 'SLR Average Time',
                       data: slrAvg
                   },{
                       name: 'LLV QA Total Time',
                       data: llvQaLog,
                       visible:false
                   },{
                       name: 'LLV QA Average Time',
                       data: llvQaAvgLog
                   },{
                      name: 'DMZ Latency',
                      data: dmzLatencyLog,
                      visible:true,
                      type: 'column',
                      yAxis: 1,
                      index:0,
                      color:  'rgba(228,211,84,0.5)'
                   },{
                      name: 'DMZ Read Count',
                      data: dmzReadsLog,
                      visible:false,
                      type: 'column',
                      yAxis: 2,
                      index:1,
                      color:  'rgba(128,133,232,0.5)'
                   }]
               });
        });
});

function parseDmzLogs(log){
  log = JSON.parse("["+ log.trim().slice(0, - 1) + "]");
  logLatency = log.map(function(val){ return [val[0],val[3]];});
  logReads = log.map(function(val){ return [val[0],val[1]];});
  logWrites = log.map(function(val){ return [val[0],val[2]];});

  return [logReads,logWrites,logLatency];
}