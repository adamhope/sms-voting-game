// TODO: lots of refactoring

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

var scoreData, chart;

var setupGraphSwitcher = function () {
  // graph switcher
  $('.switcher').click(function () {
    var newType = $(this).attr('id');
    ChangeChartType(chart, chart.series, newType);
  });
};

var renderGraph = function(data) {

  scoreData = data.scoreData;

  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'highchart',
      type: 'column',
      height: 350
    },
    title: {
      text: 'Scoreboard'
    },
    xAxis: {
      categories: scoreData.participants
    },
    yAxis: {
      title: {
        text: 'Points'
      }
    },
    series: [{
      name: 'Points',
      data: scoreData.scores
    }]
  });

  setupGraphSwitcher();

};

$(document).ready(function() {
  $.getJSON('/participants/json', renderGraph);
});
