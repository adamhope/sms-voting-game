$(document).ready(function() {
  $("#leaderboard").hide();
  $.getJSON('/participants/links', initGraph);
  $.getJSON('/participants/json', updateLeaderboard);
});

// TODO: quick hack to prevent graph from re-drawing if data hasn't actually changed until we implement socket.io
setInterval(function () {
  $.getJSON('/participants/links', updateGraph);
  $.getJSON('/participants/json', updateLeaderboard);
}, 2000);



setInterval(function() { 

  if ($("#network-graph").is(":visible")) {
    $("#network-graph").hide();
    $("#leaderboard").show();
  } else {
    $("#leaderboard").hide();
    $("#network-graph").show();
  }
}, 2000);