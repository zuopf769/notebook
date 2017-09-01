/**
 * Created by rockyren on 14/11/23.
 */
require.config({
    paths: {
        'raphael': 'packages/bower/raphael/raphael',
        'jquery': 'packages/bower/jquery/dist/jquery',
        'bootstrap': '../bootstrap/js/bootstrap.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});


require(['imp/Graph', 'imp/Renderer', 'jquery', 'bootstrap', 'raphael'],function(Graph, Renderer,$){
    var renderer = new Renderer({
        canvasId: 'mindmap-canvas'
    });
    var graph = new Graph(renderer);

    $('#node-plus').click(function(){
        graph.addNode(graph.selected, {});
    });

    $('#node-cancel').click(function(){
        if(graph.selected){
            if(graph.selected.isRootNode()){
                console.log('cannot cancel root node');
            }else{
                graph.removeNode(graph.selected);
                graph.setSelected(null);
            }
        }
    });

    $('#label-group button').click(function(){
        var text = $('#label-group input').val();
        if(graph.selected){
            graph.setLabel(graph.selected, text);
        }
    });


});
