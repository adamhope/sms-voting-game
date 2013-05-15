$(document).ready(function() {

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

  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'highchart',
      type: 'column',
      height: 350
    },
    title: {
      text: 'Scoreboard'
    },
    xAxis: {
      categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    },
    yAxis: {
      title: {
        text: 'Points'
      }
    },
    series: [{
      name: 'Points',
      data: [5, 10, 20, 22, 25, 28, 30, 40, 80, 90]
    }]
  });

  // Switchers (of the Chart1 type) - onclick handler
  $('.switcher').click(function () {
    var newType = $(this).attr('id');
    ChangeChartType(chart, chart.series, newType);
  });
});
