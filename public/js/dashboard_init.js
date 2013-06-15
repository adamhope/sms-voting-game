$(document).ready(function() {
  $.getJSON('/participants/links', initGraph);
  $.getJSON('/participants/json', updateLeaderboard);
});

// TODO: quick hack to prevent graph from re-drawing if data hasn't actually changed until we implement socket.io
setInterval(function () {
  $.getJSON('/participants/links', updateGraph);
  $.getJSON('/participants/json', updateLeaderboard);
}, 2000);
