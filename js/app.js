$(function () {
        $.getJSON("logs/llv_p_log.json",function (log) {
            //$.getJSON("avg_log.json",function (avg) {
                var avg = [];
                /*avg.forEach(function (v) {
                    v[0] = Date.parse(v[0]);
                });*/

                log.forEach(function (v) {
                    $('#table').append('<div><span class="date">'+new Date(Date.parse(v[0]))+'</span> <span class="resTime">'+parseInt(v[1])+'sec</span></div>')
                    v[0] = Date.parse(v[0]);
                    avg.push([v[0], (v[1]/250)]);
                });
                console.log(avg);
                $('#chart').highcharts({
                    chart: {
                        type: 'spline',
                        zoomType: 'x'
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
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
                        max: 2000

                    },
                    /*tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                    },*/

                    series: [{
                        name: 'Total Time',
                        data: log
                    },{
                        name: 'Average Time',
                        data: avg
                    }]
                });
            //});
        });
});