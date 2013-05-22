// TODO: lots of refactoring
var scoreData, chart;

var renderGraph = function(data) {

  scoreData = data.scoreData;

  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'highchart',
      type    : 'column',
      height  : 350
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
      },
      allowDecimals: false
    },
    series: [{
      name: 'Points',
      data: scoreData.scores
    }]
  });

};

$(document).ready(function() {
  $.getJSON('/participants/json', renderGraph);
});
