  // TODO: lots of refactoring

//     // Per-type markers, as they don't inherit styles.
//     svg.append('svg:defs').selectAll('marker')
//         // TODO change this to ['participant']
//         .data(['suit', 'licensing', 'resolved'])
//       .enter().append('svg:marker')
//         .attr('id', String)
//         .attr('viewBox', '0 -5 10 10')
//         .attr('refX', 15)
//         .attr('refY', -1.5)
//         .attr('markerWidth', 6)
//         .attr('markerHeight', 6)
//         .attr('orient', 'auto')
//       .append('svg:path')
//         .attr('d', 'M0,-5L10,0L0,5');

// // A copy of the text with a thick white stroke for legibility.
// text.append('svg:text')
//     .attr('x', 8)
//     .attr('y', '.31em')
//     .attr('class', 'shadow')
//     .text(function(d) { return d.name; });

// text.append('svg:text')
//     .attr('x', 8)
//     .attr('y', '.31em')
//     .text(function(d) { return d.name; });


var graph;

function myGraph(el) {

  // Add and remove elements on the graph object
  this.addNode = function (node) {
    nodes.push({'id' : node.id, 'name' : node.name, 'size' : node.size });
    update();
  };

  this.removeNode = function (id) {
    var i = 0,
        n = findNode(id);
    while (i < links.length) {
      if ((links[i].source == n)||(links[i].target == n)) {
        links.splice(i,1);
      } else {
        i++;
      }
    }
    nodes.splice(findNodeIndex(id),1);
    update();
  };

  this.removeLink = function (source,target){
    for(var i=0;i<links.length;i++) {
      if(links[i].source.id == source && links[i].target.id == target) {
        links.splice(i,1);
        break;
      }
    }
    update();
  };

  this.removeallLinks = function(){
    links.splice(0,links.length);
    update();
  };

  this.removeAllNodes = function(){
    nodes.splice(0,links.length);
    update();
  };

  this.addLink = function (source, target, value) {
    links.push({'source':findNode(source),'target':findNode(target),'value':value});
    update();
  };

  var findNode = function(id) {
    for (var i in nodes) {
      if (nodes[i].id === id) return nodes[i];
    }
  };

  var findNodeIndex = function(id) {
    for (var i=0;i<nodes.length;i++) {
      if (nodes[i].id==id){
          return i;
      }
    }
  };

  // set up the D3 visualisation in the specified element
  var w = 1200,
      h = 700;

  var vis = d3.select(el)
    .append('svg:svg')
    .attr('width', w)
    .attr('height', h)
    .attr('id', 'svg')
    .attr('pointer-events', 'all')
    .attr('viewBox', '0 0 ' + w + ' ' + h)
    .attr('perserveAspectRatio', 'xMinYMid')
    .append('svg:g');

  var force = d3.layout.force(),
      nodes = force.nodes(),
      links = force.links();

  var update = function () {

    var link = vis.selectAll('line')
      .data(links, function(d) {
        return d.source.id + '-' + d.target.id;
      });

    link.enter().append('line')
      .attr('id',function(d){return d.source.id + '-' + d.target.id;})
      .attr('class', 'link');

    link.append('title')
      .text(function(d){
          return d.value;
      });

    link.exit().remove();

    var node = vis.selectAll('g.node')
      .data(nodes, function(d) {
        return d.id;
      });

    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

    nodeEnter.append('svg:circle')
      .attr('r', function(d) { return Math.pow(d.size, 1.3) + 5;})
      .attr('id',function(d) { return 'Node;'+d.id;})
      .attr('class', 'nodeStrokeClass');

    nodeEnter.append('svg:text')
      .attr('class', 'nodeLabel')
      .attr('x', 8)
      .attr('y', '.31em')
      .text( function(d){ return d.name;});

    node.exit().remove();

    force.on('tick', function() {
      node.attr('transform', function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; });
      link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
    });

    // Restart the force layout.
    force
      .gravity(0.05)
      .distance(100)
      .charge(-100)
      .linkDistance(200)
      .size([w, h])
      .start();
  };

  update();

}

// XXX these are quick hacks to make up for the fact that we are constantly polling the server instead of using socket.io
var nodeCount = 0,
    linkCount = 0;

function initGraph(data) {
  graph = new myGraph('#d3');
  updateGraph(data);
}

function updateGraph(data) {

  $('.amount').text(data.totalDonation);

  if (data.nodeCount != nodeCount || data.linkCount != linkCount) {

    nodeCount = data.nodeCount;
    linkCount = data.linkCount;

    data.nodes.forEach(function (node) {
      graph.addNode(node);
    });

    data.links.forEach(function (link) {
      graph.addLink(link.source, link.target, 10);
    });

  }

}

$(document).ready(function() {
  $.getJSON('/participants/links', initGraph);
});

// TODO: quick hack to prevent graph from re-drawing if data hasn't actually changed until we implement socket.io
setInterval(function () {
  $.getJSON('/participants/links', updateGraph);
}, 2000);
