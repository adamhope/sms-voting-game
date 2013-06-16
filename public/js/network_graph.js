// TODO: lots of refactoring

var graph;

function myGraph(el) {

  // Add and remove elements on the graph object
  this.addNode = function (node) {
    nodes.push({
      'id' : node.id,
      'name' : node.name,
      'size' : node.size,
      'color': '#'+Math.floor(Math.random()*16777215).toString(16)
    });
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

  var force = d3.layout.force(),
      links = force.links(),
      nodes = force.nodes();


  var update = function () {
    //LINKS

    var link = vis.selectAll('.link')
      .data(links, function(d) {
        return d.source.id + '-' + d.target.id;
      });

    link.enter().append('line')
      .attr('id',function(d){return d.source.id + '-' + d.target.id;})
      .attr('class', 'link');

    link.exit().remove();

    //NODES

    var node = vis.selectAll('.node')
      .data(nodes, function(d) {
        return d.id;
      });

    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

    nodeEnter.append('svg:circle')
      .attr('r', function(d) { return Math.pow(d.size, 1.3) + 20;})
      .attr('id',function(d) { return 'Node;'+d.id;})
      .style("fill", function(d) { return d.color; })
      .attr("stroke-width", 10)
      .style("stroke", "#FF0000")

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

    force
      .gravity(.05)
      .charge(-200)
      .linkDistance( 200 )
      .size([w, h])
      .start();
  };

  update();

}

// XXX these are quick hacks to make up for the fact that we are constantly polling the server instead of using socket.io
var nodeCount = 0,
    linkCount = 0;

function initGraph(data) {
  graph = new myGraph('#network-graph');
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
