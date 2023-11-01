function SynopsisScopeController() {

  this.document_interface = null;
  this.scope = null;

  // ---------------------------------------------------------------------------

  let selected  = new Set();
  let nodes     = new Set();

  let move_state = {
    drag_node: null,
    node_offset: new Map(),
    last_event: null
  };

  let controlled_pressed = false;

  // ---------------------------------------------------------------------------

  const key_listen_down = e => {
    if (e.key == "Delete") delete_selected();
    else if (e.key == "Control") controlled_pressed = true;
  }

  const key_listen_up = e => {
    if (e.key == "Control") controlled_pressed = false;
  }

  const scope_unbind = () => {
    this.scope = null;
  }

  const scope_bind = scope => {
  
    scope_unbind();
    this.scope = scope;
    

  }

  const unbind = () => {
    this.document_interface.on_load_scope.unsubscribe(scope_bind);
    scope_unbind();
    window.removeEventListener("keydown", key_listen_down);
    window.removeEventListener("keyup", key_listen_up);
    this.document_interface = null;
  }

  const bind = document_interface => {
    this.document_interface = document_interface;
    this.document_interface.on_load_scope.subscribe(scope_bind);
    window.addEventListener("keydown", key_listen_down);
    window.addEventListener("keyup", key_listen_up);
  } 

  // ---------------------------------------------------------------------------

  this.bind   = bind; 
  this.unbind = unbind;
  
}