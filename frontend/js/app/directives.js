'use strict';

/* Directives */


angular.module('harPerformanceMonitor.directives', []).
  
directive('performanceChart', [function() {
  return {
    restrict: 'E',
    template:' <div id="chart"></div>',
    scope:{
        control:'='
    },
    link: function (scope, element, attrs) {
      // functions and properties from internal conteol will be accessible to controller that bind an object with scope.control
      scope.internalControl = scope.control || {};      
      scope.internalControl.addSeries = function (series) {
          element.highcharts().addSeries(series);
      }
      
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });

      
      element.height($("body").height() - $(".profile-selector").outerHeight() - 10);
      element.width(angular.element('.container').width());

      /**
       * Start Defining chart here
       */
      element.highcharts('StockChart',{
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
              text: null
          },
          subtitle: {
              text: null
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

          series: [],
          credits: {
                    enabled: false
                }
      }); 
    }
  };
}]);
