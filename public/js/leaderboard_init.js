$(document).ready(function() {
  $.getJSON('/participants/json', updateLeaderboard);
  setInterval(function () {
    $.getJSON('/participants/json', updateLeaderboard);
  }, 2000);
});
