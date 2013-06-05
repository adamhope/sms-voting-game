// // Based on http://bl.ocks.org/mbostock/1062383
// // TODO
// // - more refactoring
// // - dynamically add nodes
// // - update appearnce of node as number of connections increases
// // - find out where undefined node comes from...

// // SVG Document Structure
// // - SVG
// //   - defs
// //     marker
// //     licensing
// //     resolved
// //   - g
// //      paths
// //      ...
// //      ...
// //   - g
// //      circles
// //      ...
// //      ...
// //   - g
// //      - g
// //        text
// //        text
// //      ...
// //      ...

// var dashboard = (function () {

//   var nodes = {},
//       cfg = {
//         w: 960,
//         h: 500
//       },
//       force, links, svg,
//       circle, path, text;

//   // Compute the distinct nodes from the links.
//   // NOTE this is just updating the dataset. Nothing to do with re-drawing the graph?
//   function addLink(link) {
//     link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
//     link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
//   }

//   function init(data) {

//     links = data.links;

//     links.forEach(addLink);

//     svg = d3.select('body').append('svg:svg')
//       .attr('width', cfg.w)
//       .attr('height', cfg.h);

//     force = d3.layout.force()
//       .nodes(d3.values(nodes))
//       .links(links)
//       .size([cfg.w, cfg.h])
//       .linkDistance(90)
//       .charge(-300)
//       .start();

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

//     force.on('tick', function (e) {

//       // path.attr('d', function(d) {
//       //   var dx = d.target.x - d.source.x,
//       //       dy = d.target.y - d.source.y,
//       //       dr = Math.sqrt(dx * dx + dy * dy);
//       //   return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
//       // });

//       circle.attr('transform', function(d) {
//         return 'translate(' + d.x + ',' + d.y + ')';
//       });

//       // text.attr('transform', function(d) {
//       //   return 'translate(' + d.x + ',' + d.y + ')';
//       // });
//     });

//     update();

//   }


//   function update(link) {

//     // NOTE update dataset
//     if (link) {
//       addLink(link);
//     }

//     // NOTE restart drawing again
//     force.start();

//     // --- THE ACTUAL DRAWING
//     // NOTE create an SVG container element and add paths/links
//     // path = svg.append('svg:g').selectAll('path')
//     //     .data(force.links())
//     //   .enter().append('svg:path')
//     //     .attr('class', function(d) { return 'link ' + d.type; })
//     //     .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; });

//     // NOTE Adding nodes
//     circle = svg.append('svg:g').selectAll('circle')
//         .data(force.nodes())
//       .enter().append('svg:circle')
//         .attr('r', 6)
//         .call(force.drag);

//     // // NOTE adding node text
//     // text = svg.append('svg:g').selectAll('g')
//     //     .data(force.nodes())
//     //   .enter().append('svg:g');

//     // // A copy of the text with a thick white stroke for legibility.
//     // text.append('svg:text')
//     //     .attr('x', 8)
//     //     .attr('y', '.31em')
//     //     .attr('class', 'shadow')
//     //     .text(function(d) { return d.name; });

//     // text.append('svg:text')
//     //     .attr('x', 8)
//     //     .attr('y', '.31em')
//     //     .text(function(d) { return d.name; });

//   }

//   return {
//     update: update,
//     init  : init
//   };

// }());

// $(document).ready(function() {
//   $.getJSON('/participants/links', dashboard.init);
// });

var graph;

function myGraph(el) {

  // Add and remove elements on the graph object
  this.addNode = function (id) {
      nodes.push({"id":id});
      update();
  };

  this.removeNode = function (id) {
      var i = 0;
      var n = findNode(id);
      while (i < links.length) {
          if ((links[i]['source'] == n)||(links[i]['target'] == n))
          {
              links.splice(i,1);
          }
          else i++;
      }
      nodes.splice(findNodeIndex(id),1);
      update();
  };

  this.removeLink = function (source,target){
      for(var i=0;i<links.length;i++)
      {
          if(links[i].source.id == source && links[i].target.id == target)
          {
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
      links.push({"source":findNode(source),"target":findNode(target),"value":value});
      update();
  };

  var findNode = function(id) {
      for (var i in nodes) {
          if (nodes[i]["id"] === id) return nodes[i];};
  };

  var findNodeIndex = function(id) {
      for (var i=0;i<nodes.length;i++) {
          if (nodes[i].id==id){
              return i;
          }
          };
  };

  // set up the D3 visualisation in the specified element
  var w = 500,
      h = 500;

  var vis = d3.select("body")
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id","svg")
      .attr("pointer-events", "all")
      .attr("viewBox","0 0 "+w+" "+h)
      .attr("perserveAspectRatio","xMinYMid")
      .append('svg:g');

  var force = d3.layout.force();

  var nodes = force.nodes(),
      links = force.links();

  var update = function () {

      var link = vis.selectAll("line")
        .data(links, function(d) {
            return d.source.id + "-" + d.target.id;
            });

      link.enter().append("line")
          .attr("id",function(d){return d.source.id + "-" + d.target.id;})
          .attr("class","link");

      link.append("title")
        .text(function(d){
            return d.value;
        });

      link.exit().remove();

      var node = vis.selectAll("g.node")
          .data(nodes, function(d) {
              return d.id;});

      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .call(force.drag);

      nodeEnter.append("svg:circle")
        .attr("r", 16)
        .attr("id",function(d) { return "Node;"+d.id;})
        .attr("class","nodeStrokeClass");

      nodeEnter.append("svg:text")
        .attr("class","textClass")
        .text( function(d){return d.id;}) ;

      node.exit().remove();

      force.on("tick", function() {

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y         + ")"; });

          link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
      });

      // Restart the force layout.
      force
        .gravity(.05)
        .distance(50)
        .linkDistance( 50 )
        .size([w, h])
        .start();
  };


  // Make it all go
  update();

}

function drawGraph(data) {

  console.log(data);

  graph = new myGraph("#svgdiv");

  data.nodes.forEach(function (node) {
    graph.addNode(node.id);
    console.log(node.v);
  });

  data.links.forEach(function (link) {
    graph.addLink(link.source, link.target, 10);
  });

}

$(document).ready(function() {
  $.getJSON('/participants/links', drawGraph);
});
