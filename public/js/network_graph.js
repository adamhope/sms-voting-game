// TODO: lots of refactoring
var graph;

function myGraph(el) {
  // Add and remove elements on the graph object
  this.addNode = function (node) {
    nodes.push({
      'id' : node.id,
      'name' : node.name,
      'size' : node.size,
      'color': generateColor()
    });
  };

  this.addLink = function (source, target, value) {
    links.push({'source':findNode(source),'target':findNode(target),'value':value});
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

  this.upd = function() {
    update();
  };

  var generateColor = function() {
    return ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
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
    .attr('pointer-events', 'all')
    .call(d3.behavior.zoom().on('zoom', update));

  var linkGroup = vis.append('g').attr('class', 'links');
  var nodeGroup = vis.append('g').attr('class', 'nodes');

  var force = d3.layout.force(),
      links = force.links(),
      nodes = force.nodes();


  var update = function () {

    //LINKS
    var link = linkGroup.selectAll('.link')
      .data(links, function(d) {
        return d.source.id + '-' + d.target.id;
      });

    link.enter().append('line')
      .attr('id',function(d){return d.source.id + '-' + d.target.id;})
      .attr('class', 'link');

    link.exit().remove();

    //NODES
    var node = nodeGroup.selectAll('.node')
      .data(nodes, function(d) {
        return d.id;
      });

    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

    nodeEnter.append('svg:circle')
      .attr('r', function(d) { return Math.pow(d.size, 2.0) + 10;})
      .attr('id',function(d) { return 'node-' + d.id})
      .style('fill', function(d) { return d.color; })
      .attr('stroke-width', 10);

    nodeEnter.append('svg:text')
      .attr('x', function(d) { return Math.pow(d.size, 2.0) + 20; })
      .attr('dy', '.35em')
      .attr('fill', '#9ecae1')
      .text( function(d){ return d.name;});

    nodes.forEach(function(node) {
      nodeGroup.select('#node-' + node.id)
        .transition().duration(500)
        .attr('r', Math.pow(node.size, 2.0) + 10);
    });

    node.exit().remove();

    force.on('tick', function() {
      node.attr('transform', function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; });
       link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    });

    force
      .gravity(0.06)
      .charge(function(d) { return d._children ? 0 : -100 ;}) // -200
      .linkDistance(function(d) { return d.target._children ? 100 : 100; }) // 100
      .size([w, h])
      .start();
  };

  update();

}

// XXX these are quick hacks to make up for the fact that we are constantly polling the server instead of using socket.io
var nodeCount   = 0,
    linkCount   = 0,
    totalScores = 0;

function initGraph(data) {
  graph = new myGraph('#network-graph');
  updateGraph(data);
}

function sizesChanged(data) {
  var sum = 0;
  for (var i = 0; i < data.nodes.length; i++) {
    sum += data.nodes[i].size;
  }
  return sum;
}

function updateGraph(data) {

  $('.amount').text(data.totalDonation);

  if (data.nodeCount != nodeCount || data.linkCount != linkCount || sizesChanged(data) != totalScores ) {

    data.nodes.forEach(function (node) {
      graph.addNode(node);
    });

    data.links.forEach(function (link) {
      graph.addLink(link.source, link.target, 10);
    });

    totalScores = sizesChanged(data);
    nodeCount = data.nodeCount;
    linkCount = data.linkCount;
    graph.upd();
  }
}
