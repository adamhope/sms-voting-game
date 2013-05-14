/**
 *
 * Active Charts using Highcharts demonstration
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// Change Chart type function
function ChangeChartType(chart, series, newType) {
    newType = newType.toLowerCase();
    for (var i = 0; i < series.length; i++) {
        var srs = series[0];
        try {
            srs.chart.addSeries({
                type: newType,
                stack: srs.stack,
                yaxis: srs.yaxis,
                name: srs.name,
                color: srs.color,
                data: srs.options.data
            },
            false);
            series[0].remove();
        } catch (e) {
        }
    }
}

var chart1;

// Once DOM (document) is finished loading
$(document).ready(function() {

    // First chart initialization
    chart1 = new Highcharts.Chart({
     chart: {
        renderTo: 'chart_1',
        type: 'column',
        height: 350,
     },
     title: {
        text: 'Scoreboard'
     },
     xAxis: {
        categories: ['Processing.js', 'Impact.js', 'Other', 'Ease.js', 'Box2D.js', 'WebGL', 'DOM', 'CSS', 'Canvas', 'Javascript']
     },
     yAxis: {
        title: {
           text: 'Points'
        }
     },
     series: [{
        name: 'Dev #1',
        data: [5, 10, 20, 22, 25, 28, 30, 40, 80, 90]
     }, {
        name: 'Dev #2',
        data: [15, 15, 18, 40, 30, 25, 60, 60, 80, 70]
     }, {
        name: 'Dev #3',
        data: [1, 3, 6, 0, 50, 25, 50, 60, 30, 100]
     }]
    });

    // Switchers (of the Chart1 type) - onclick handler
    $('.switcher').click(function () {
        var newType = $(this).attr('id');
        ChangeChartType(chart1, chart1.series, newType);
    });
});
