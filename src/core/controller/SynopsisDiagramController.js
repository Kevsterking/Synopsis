function SynopsisDiagramController() {

  this.diagram = null;

  this.on_scroll = new SynopsisEvent();

  this.scroller = new SynopsisScroller();

  // ---------------------------------------------------------------------------

  const on_scroll = pos => {
    this.diagram.set_translation(pos.x, pos.y);
    this.on_scroll.trigger();
  }

  const diagram_resize = () => {
    this.scroller.set_position_no_event(this.diagram.translation.x, this.diagram.translation.y);
  }

  const diagram_load = () => {
    this.scroller.bind(this.diagram.dom.root, on_scroll, this.diagram.extent);
  }

  const unbind = () => {
    
    this.diagram.on_load.unsubscribe(diagram_load);
    this.diagram.on_resize.unsubscribe(diagram_resize);
    
    this.scroller.unbind();
    
    this.diagram = null;
  
  }

  const bind = document_interface => {

    this.diagram = document_interface.diagram;
    
    this.diagram.on_load.subscribe(diagram_load);
    this.diagram.on_resize.subscribe(diagram_resize);
    
  }

  // ---------------------------------------------------------------------------

  this.bind   = bind;
  this.unbind = unbind;

}