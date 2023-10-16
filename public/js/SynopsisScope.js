
function SynopsisScope(obj, parent_scope=null) {
    
    this.obj = obj;

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

    const update_obj = () => {
        
        const nodes = [];

        this.nodes.forEach((scope, _) => {
            nodes.push(scope.obj);
        });

        this.obj.nodes = nodes; 

    }

    // ---------------------------------------------------------------------------

    this.add_node = node => {

        if (this.nodes.has(node)) return -1;

        const node_obj = {};
        const new_scope = new SynopsisScope(node_obj, this);

        this.nodes.set(node, new_scope);
        
        update_obj();
        
    }

    this.delete_node = node => {
        
        if (!this.nodes.has(node)) return -1;

        this.nodes.delete(node);

        update_obj();

    }

    this.get_scope = node => {
        return this.nodes.get(node);
    }

    // ---------------------------------------------------------------------------

    load_from_obj(obj);

}