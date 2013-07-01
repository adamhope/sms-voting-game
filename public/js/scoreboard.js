var updateScoreboard = function (data) {
  var ctx = $('#scoreboard');
  $('.visualization-header', ctx).text('Scoreboard');
  $('.visualization-body', ctx).html('<ol class="all" />');
  $(data).each(function () {
    $('.all', ctx).append('<li><strong>' + this.score + '</strong>' + this.username + '</li>');
  });
};
