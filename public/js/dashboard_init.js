// NOTE: OMG this is horrible...
var state                   = 'networkGraph',
    leaderBoardDisplayTime  = 5000,
    networkGraphDisplayTime = 10000;

// TODO: this code should probably put in the respective JS files
setInterval(function () {
  $.getJSON('/participants/links', updateGraph);
  $.getJSON('/participants/json', updateLeaderboard);
}, 2000);

function displayNetworkGraph() {
  clearInterval(window.timer);
  window.timer = setTimeout(displayLeaderboard, networkGraphDisplayTime);
  $('#leaderboard').fadeOut();
  $('#network-graph').fadeIn();
  $('#dashboard-title h1').text('Mingle Map');
}

function displayLeaderboard() {
  clearInterval(window.timer);
  window.timer = setTimeout(displayNetworkGraph, leaderBoardDisplayTime);
  $('#network-graph').fadeOut();
  $('#leaderboard').fadeIn();
  $('#dashboard-title h1').text('Top 10 Minglers');
}

$(document).ready(function() {
  $.getJSON('/participants/links', initGraph);
  $.getJSON('/participants/json', updateLeaderboard);
  displayNetworkGraph();
});
