function SynopsisNodeController(node) {

  SynopsisBindManager.call(this);

  this.on_click         = new SynopsisEvent();
  this.on_mouse_down    = new SynopsisEvent();
  this.on_mouse_up      = new SynopsisEvent();
  this.on_mouse_move    = new SynopsisEvent();
  this.on_double_click  = new SynopsisEvent();

  // ---------------------------------------------------------------------------

  let cancel_dbkclick = false;
  let last_mousedown_time = Date.now();

  // ---------------------------------------------------------------------------

  const mousemove = e => {
    cancel_dbkclick = true;
    this.on_mouse_move.trigger(e);
  }

  const click = e => this.on_click.trigger;

  const mouseup = e => {

    if (e.button != 0) {
      return;
    }

    this.on_mouse_up.trigger(e);    

  } 

  const mousedown = e => {

    e.preventDefault();

    if (e.button != 0) {
      return;
    }

    this.on_mouse_down.trigger(e);

    if (Date.now() - last_mousedown_time < 500 && !cancel_dbkclick) {
      this.on_double_click.trigger(e);
      return;
    }

    last_mousedown_time = Date.now();
    cancel_dbkclick = false;
  
  }

  const node_bind = () => {
    this.add_bind(() => this.node.dom.root.addEventListener("mouseup", mouseup),      () => this.node.dom.root.removeEventListener("mouseup", mouseup));
    this.add_bind(() => this.node.dom.root.addEventListener("mousedown", mousedown),  () => this.node.dom.root.removeEventListener("mousedown", mousedown));
    this.add_bind(() => this.node.dom.root.addEventListener("mousemove", mousemove),  () => this.node.dom.root.removeEventListener("mousemove", mousemove));
    this.add_bind(() => this.node.dom.root.addEventListener("click", click),          () => this.node.dom.root.removeEventListener("click", click));
  }

  const bind = node => {
    
    this.unbind();
  
    this.add_bind(() => { this.node = node },                       () => { this.node = null }, null);
    
    if (node.spawned) {
      node_bind();
    } else {
      this.add_bind(() => this.node.on_load.subscribe(node_bind), () => this.node.on_load.unsubscribe(node_bind));
    }
    
    this.add_bind(() => this.node.on_delete.subscribe(this.unbind), () => this.node.on_delete.unsubscribe(this.unbind));
  
  }

  // ---------------------------------------------------------------------------

  this.bind = bind;

  // ---------------------------------------------------------------------------

  bind(node);

}