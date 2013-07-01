setInterval(function () {
  $.getJSON('/participants/links', updateGraph);
}, 2000);

$(document).ready(function() {
  $.getJSON('/participants/links', initGraph);
});
