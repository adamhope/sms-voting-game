$(document).ready(function() {
  $.getJSON('/participants/json', updateScoreboard);
});
