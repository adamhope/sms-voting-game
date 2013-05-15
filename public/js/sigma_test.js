$(document).ready(function(){

    // Instanciate sigma.js and customize it :
    var sigInst = sigma.init(document.getElementById('sig')).drawingProperties({
        defaultLabelColor: '#fff'
    });

    function randomRGB() {
        return 'rgb('+Math.round(Math.random()*256)+','+
            Math.round(Math.random()*256)+','+
            Math.round(Math.random()*256)+')';
    }

    // Generate a random graph with :
    //   . N nodes
    //   . E edges
    //   . C clusters
    //   . d the proportion of edges that connect two nodes
    //     from the same cluster
    var i,
        N = 20,
        E = 500,
        C = 5,
        d = 0.5,
        clusters = [];

    for(i = 0; i < C; i++){
        clusters.push({
            'id': i,
            'nodes': [],
            'color': randomRGB()
        });
    }

    for(i = 0; i < N; i++){
        var cluster = clusters[(Math.random()*C)|0];
        sigInst.addNode('n'+i,{
            'x'      : Math.random(),
            'y'      : Math.random(),
            'size'   : 0.5+4.5*Math.random(),
            'color'  : cluster['color'],
            'cluster': cluster['id']
        });
        cluster.nodes.push('n'+i);
    }

    for(i = 0; i < E; i++){
        if (Math.random() < 1-d) {
            sigInst.addEdge(i,'n'+(Math.random()*N|0),'n'+(Math.random()*N|0));
        } else {
            var cluster = clusters[(Math.random()*C)|0], n = cluster.nodes.length;
            sigInst.addEdge(i,cluster.nodes[Math.random()*n|0],cluster.nodes[Math.random()*n|0]);
        }
    }

    sigInst.draw();

    window.signInst = sigInst;

});


// http://gexf.net/data/basic.gexf

// <?xml version="1.0" encoding="UTF-8"?>
// <gexf xmlns="http://www.gexf.net/1.2draft" version="1.2">
//     <graph mode="static" defaultedgetype="directed">
//         <nodes>
//             <node id="0" label="Hello" />
//             <node id="1" label="Word" />
//         </nodes>
//         <edges>
//             <edge id="0" source="0" target="1" />
//         </edges>
//     </graph>
// </gexf>
