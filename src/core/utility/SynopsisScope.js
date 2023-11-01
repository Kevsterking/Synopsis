
function SynopsisScope(obj, parent_scope=null) {

    this.obj = obj; 

    this.on_add_node = new SynopsisEvent();

    this.parent_scope = parent_scope;

    this.node_container = new SynopsisNodeContainer();

    this.nodes = new Map();
    this.edges = null;

    // ---------------------------------------------------------------------------

    const update_obj = () => {
        
        const nodes = [];

        this.nodes.forEach((scope, _) => {
            nodes.push(scope.obj);
        });

        this.obj.nodes = nodes; 
        
    }

    const delete_node = node => {
        if (!this.nodes.has(node)) return -1;
        this.nodes.delete(node);
        update_obj();
    }

    const add_node = (node, scope = null) => {

        if (this.nodes.has(node)) return -1;

        const node_scope = scope ? scope : new SynopsisScope({}, this);

        node.on_move.subscribe(() => {
            node_scope.obj.x = node.position.x;
            node_scope.obj.y = node.position.y;
            update_obj();
        });

        node_scope.obj.html = node.html;

        node_scope.obj.x = node.position.x;
        node_scope.obj.y = node.position.y;

        this.nodes.set(node, node_scope);
        this.node_container.add_node(node);

        update_obj();

        this.on_add_node.trigger(node);

    } 

    const load_from_obj = obj => {

        this.nodes.clear();

        if (obj.nodes) {
            for (const node_obj of obj.nodes) {

                const new_node = new SynopsisNode();
                const new_scope = new SynopsisScope(node_obj, this);

                new_node.position.x = node_obj.x;
                new_node.position.y = node_obj.y;

                new_node.html = node_obj.html;

                new_node.on_move.subscribe(() => {
                    node_obj.x = new_node.position.x;
                    node_obj.y = new_node.position.y;
                });

                add_node(new_node);

            }
        }

    }

    // ---------------------------------------------------------------------------

    this.add_node       = add_node;
    this.delete_node    = delete_node;
    this.load_from_obj  = load_from_obj;

    this.get_scope = node => {
        return this.nodes.get(node);
    }

    // ---------------------------------------------------------------------------

    this.node_container.spawn().then(() => {
        load_from_obj(obj);
    });

}