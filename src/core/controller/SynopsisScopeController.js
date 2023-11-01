function SynopsisScopeController() {

  this.document_interface = null;
  this.scope = null;

  this.nodes = new Map();

  // ---------------------------------------------------------------------------

  let selected = new Set();

  let move_state = {
    drag_node: null,
    node_offset: new Map(),
    last_event: null
  };

  let control_pressed = false;

  // ---------------------------------------------------------------------------

  const key_listen_down = e => {
    if (e.key == "Delete") delete_selected();
    else if (e.key == "Control") control_pressed = true;
  }

  const key_listen_up = e => {
    if (e.key == "Control") control_pressed = false;
  }

  const clear_selection = () => {

    for (const node of selected) {
      node.dehighlight();
    }

    selected.clear();

  }

  const select_node = node => {
    
    return e => {
      
      e.stopPropagation();

      if (!control_pressed && !selected.has(node)) {
        clear_selection();
      }

      selected.add(node);

      node.highlight();
    
    }

  }

  const content_mousedown = e => {
    !control_pressed ? clear_selection() : 0;
  }

  const unbind_node = node => {
    const node_controller = this.nodes.get(node);
    node_controller.unbind();
    //node_controller.on_click.unsubscribe(select_node);
    this.nodes.delete(node);
  }

  const bind_node = node => {
    
    const node_controller = new SynopsisNodeController(node); 
    
    node_controller.on_click.subscribe(select_node(node));
    
    this.nodes.set(node, node_controller);
  }

  const unbind_all_nodes = () => {
    for (const node of this.nodes) {
      unbind_node(node);
    }
  }

  const scope_unbind = () => {
    this.scope.on_add_node.unsubscribe(bind_node);
    unbind_all_nodes();
    this.scope = null;
  }

  const scope_bind = scope => {
    this.scope ? scope_unbind(): 0;
    this.scope = scope;
    this.scope.on_add_node.subscribe(bind_node);
  }

  const unbind = () => {
    this.document_interface.on_load_scope.unsubscribe(scope_bind);
    this.document_interface.dom.content.removeEventListener("mousedown", content_mousedown);
    scope_unbind();
    window.removeEventListener("keydown", key_listen_down);
    window.removeEventListener("keyup", key_listen_up);
    this.document_interface = null;
  }

  const bind = document_interface => {
    this.document_interface = document_interface;
    this.document_interface.on_load_scope.subscribe(scope_bind);
    this.document_interface.dom.content.addEventListener("mousedown", content_mousedown);
    window.addEventListener("keydown", key_listen_down);
    window.addEventListener("keyup", key_listen_up);
  } 

  // ---------------------------------------------------------------------------

  this.bind   = bind; 
  this.unbind = unbind;
  
}