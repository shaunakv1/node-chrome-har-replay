$(function () {
       var chart = addChart();
       $("#addProfile").click(function (evt) {
          addProfile(chart, 'llv_agol_har.json');
       });
});

function addProfile(chart, profileID){
  $.when(
      $.getJSON('http://localhost:4731/getPerformanceProfile?profile='+profileID+'&callback=?')
  ).then(function(log) {
        log = log.data.map(function(log){
          return [Date.parse(log.timestamp), log.avg];
        });

        chart.addSeries({
          data:log,
          name:profileID
        })

        /*llvQaLog = llvQaLog[0];
        llvQaAvgLog = _.map(llvQaAvgLog[0],function(v){ return [v[0],v[1]+100]; }); // offset slr average by 200 so it is visible*/
  });
}

function addChart(){
  Highcharts.setOptions({
      global: {
          useUTC: false
      }
  });

  $('#chart').height($("body").height() - 200);
  $('#chart').highcharts('StockChart',{
      chart: {
          type: 'spline',
          zoomType: 'x'
      },
      rangeSelector: {
       buttons: [{
         type: 'day',
         count: 1,
         text: '1 day'
       },{
         type: 'week',
         count: 1,
         text: '1 wk'
       },{
         type: 'month',
         count: 1,
         text: '1m'
       },{
         type: 'all',
         text: 'All'
       }]
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

         //min: log[0][0],
         //max: log[log.length -1 ][0],
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
                //max: 25000

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

      series: []
  });

  return $('#chart').highcharts();
}
/*function parseDmzLogs(log,weeks){
  log = JSON.parse("["+ log.trim().slice(0, - 1) + "]");

  var currentDate = new Date();
  var checkDate = new Date(currentDate.setDate(currentDate.getDate() - weeks * 7 ));

  var filteredLog = _.reject(log, function(entry){
    var entryDate = new Date(Date.parse(entry[0]));
      return entryDate < checkDate;
  });

  logLatency = filteredLog.map(function(val){ return [val[0],val[3]];});
  logReads = filteredLog.map(function(val){ return [val[0],val[1]];});
  logWrites = filteredLog.map(function(val){ return [val[0],val[2]];});

  return [logReads,logWrites,logLatency];
}*/