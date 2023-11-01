function SynopsisNodeController(node) {

  this.node = node;

  this.on_click         = new SynopsisEvent();
  this.on_double_click  = new SynopsisEvent();

  // ---------------------------------------------------------------------------

  let cancel_dbkclick = false;
  let last_mousedown_time = Date.now();

  // ---------------------------------------------------------------------------

  const mousemove = _ => {
    cancel_dbkclick = true;
  }

  const mousedown = e => {

    if (e.button != 0) {
      return;
    }

    this.on_click.trigger(e);

    if (Date.now() - last_mousedown_time < 500 && !cancel_dbkclick) {
      this.on_double_click.trigger(e);
      return;
    }

    last_mousedown_time = Date.now();
    cancel_dbkclick = false;

  }

  const node_bind = () => {
    this.node.dom.root.addEventListener("mousemove", mousemove);
    this.node.dom.root.addEventListener("mousedown", mousedown);
  }

  const node_unbind = () => {
    this.node.dom.root.removeEventListener("mousemove", mousemove);
    this.node.dom.root.removeEventListener("mousedown", mousedown);
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