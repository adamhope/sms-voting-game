// TODO: lots of refactoring
var scoreData, chart;

var draw = function(data) {

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

  $('.amount').text(scoreData.totalScore * 1);

};

$(document).ready(function() {
  $.getJSON('/participants/json', draw);
});
