var updateScoreboard = function (data) {
  var ctx = $('#scoreboard');
  $('.visualization-header', ctx).append('<b class="score">&#9733;</b>Most Connected');
  $('.visualization-body', ctx).html('<ol class="all" />');
  var topScore = data[0].score
  $(data).each(function () {
    $('.all', ctx).append('<li><div class="score-bar" style="width:' + this.score/topScore*100 + '%;"></div><b class="score">' + this.score + '</b>' + this.username + '</li>');
  });
};
