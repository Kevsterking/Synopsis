
function SynopsisScope(obj, parent_scope=null) {
    
    this.parent_scope = parent_scope;

    this.nodes = new Map();
    this.edges = null;

    // ---------------------------------------------------------------------------

    const load_from_obj = obj => {

        this.nodes.clear();
        
        if (obj.nodes) {
            for (const node_obj of obj.nodes) {

                const new_node = new SynopsisNode();
                const new_scope = new SynopsisScope(node_obj, this);
                
                new_node.position.x = node_obj.x;
                new_node.position.y = node_obj.y;

                new_node.html = node_obj.html;

                this.nodes.set(new_node, new_scope);

            }
        }


    }

    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------

    load_from_obj(obj);

}