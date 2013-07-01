var ctx = $('#hiearchial-edge-bundling');

var diameter    = 960,
    radius      = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.layout.cluster()
    .size([360, innerRadius])
    .sort(null);

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
    .interpolate('bundle')
    .tension(0.85)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select('.visualization-body', ctx).append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .append('g')
    .attr('transform', 'translate(' + radius + ',' + radius + ')');

d3.json('/participants/edgeBundling', function(error, classes) {
  var nodes = cluster.nodes(packages.root(classes)),
      links = packages.votedForBy(nodes);

  svg.selectAll('.link')
      .data(bundle(links))
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', line);

  svg.selectAll('.node')
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')'; })
    .append('text')
      .attr('dx', function(d) { return d.x < 180 ? 8 : -8; })
      .attr('dy', '.31em')
      .attr('text-anchor', function(d) { return d.x < 180 ? 'start' : 'end'; })
      .attr('transform', function(d) { return d.x < 180 ? null : 'rotate(180)'; })
      .text(function(d) { return d.key; });
});

d3.select(self.frameElement).style('height', diameter + 'px');

var packages = {

  // Lazily construct the package hierarchy from class names.
  root: function(classes) {
    var map = {};

    function find(name, data) {
      var node = map[name], i;
      if (!node) {
        node = map[name] = data || {name: name, children: []};
        if (name.length) {
          node.parent = find(name.substring(0, i = name.lastIndexOf('.')));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }

    classes.forEach(function(d) {
      find(d.name, d);
    });

    return map[''];
  },

  // Return a list of imports for the given array of nodes.
  votedForBy: function(nodes) {
    var map     = {},
        numbers = [];

    // Compute a map from name to node.
    nodes.forEach(function(d) {
      map[d.number] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
      if (d.numbers) d.numbers.forEach(function(i) {
        numbers.push({source: map[d.number], target: map[i]});
      });
    });

    return numbers;
  }
};
