// var leaderboard,
//     leaderboardData = [
//       {name: "Adam", score: "2"},
//       {name: "Nicole", score: "8"},
//       {name: "Fred", score: "12"},
//       {name: "Dom", score: "15"},
//       {name: "Olivia", score: "24"}
//     ];

var leaderboard = d3.select('#leaderboard');

function updateLeaderboard(data) {

  console.log(data);

  leaderboard.selectAll('.leaderboard')
    .data(data)
    .enter().append('div').attr('class', 'participant')
      .text(function(d) { return d.username; })
      .append('div')
        .attr('class', 'bar')
        .style('width', function(d) { return d.score * 10 + 'px'; }); // TODO width should be a percentage width

}



$(document).ready(function() {
  $.getJSON('/participants/json', updateLeaderboard);
});

// TODO: quick hack to prevent graph from re-drawing if data hasn't actually changed until we implement socket.io
// setInterval(function () {
//   $.getJSON('/participants/links', updateLeaderboard);
// }, 2000);
