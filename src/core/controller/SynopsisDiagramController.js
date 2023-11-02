function SynopsisDiagramController() {

  SynopsisBindManager.call(this);

  this.on_scroll = new SynopsisEvent();

  this.scroller = new SynopsisScroller();

  this.diagram = null;

  // ---------------------------------------------------------------------------

  const on_scroll = pos => {
    this.diagram.set_translation(pos.x, pos.y);
    this.on_scroll.trigger();
  }

  const set_translation = (x, y) => {
    this.scroller.set_position(x, y);
  }

  const reset_translation = () => {
    this.scroller.set_position_no_event(0, 0);
  }

  const diagram_resize = () => {
    this.scroller.set_position_no_event(this.diagram.translation.x, this.diagram.translation.y);
  }
  const bind_scroller = () => {
    this.add_bind(this.scroller.bind, this.scroller.unbind, [this.diagram.dom.root, on_scroll, this.diagram.extent], null);
  }

  const bind = document_interface => {
    this.add_bind(() => { this.diagram = document_interface.diagram; }, () => { this.diagram = null }, null);
    this.add_bind(this.diagram.on_load.subscribe, this.diagram.on_load.unsubscribe, bind_scroller);
    this.add_bind(this.diagram.on_resize.subscribe, this.diagram.on_resize.unsubscribe, diagram_resize);
    this.add_bind(() => document_interface.on_load_scope.subscribe(reset_translation), document_interface.on_load_scope.unsubscribe(reset_translation));
  }

  // ---------------------------------------------------------------------------

  this.bind = bind;
  this.set_translation = set_translation;

}