function SynopsisNodeController(node) {

  this.node = node;

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

  const node_unbind = () => {
    this.node.dom.root.removeEventListener("mouseup", mouseup);
    this.node.dom.root.removeEventListener("mousedown", mousedown);
    this.node.dom.root.removeEventListener("mousemove", mousemove);
    this.node.dom.root.removeEventListener("click", click);
  }

  const node_bind = () => {
    this.node.dom.root.addEventListener("mouseup", mouseup);
    this.node.dom.root.addEventListener("mousedown", mousedown);
    this.node.dom.root.addEventListener("mousemove", mousemove);
    this.node.dom.root.addEventListener("click", click);
  }

  const unbind = () => {
    this.node.on_load.unsubscribe(node_bind);
    node_unbind();
  }

  const bind = () => {
    this.node.on_load.subscribe(node_bind);
  }

  // ---------------------------------------------------------------------------

  this.node.on_delete.subscribe(unbind);

  // ---------------------------------------------------------------------------

  this.unbind = unbind;

  // ---------------------------------------------------------------------------

  bind();

}