function SynopsisDiagramController() {

  this.diagram = null;

  this.scroller = new SynopsisScroller();

  // ---------------------------------------------------------------------------

  const get_event_relative_pos = e => {
    const rect = this.diagran.dom.content.getBoundingClientRect();
    return new SynopsisCoordinate(e.x + this.diagram.scroll_position.x - rect.left, e.y + this.diagram.scroll_position.y - rect.top);
  }

  const get_event_coordinate = e => {
    const rel_cord = get_event_relative_pos(e);
    return new SynopsisCoordinate(
      this.diagram.content.extent.x.min - (this.diagram.dom.content.clientWidth - this.diagram.inset_padding) + rel_cord.x, 
      this.diagram.content.extent.y.min - (this.diagram.dom.content.clientHeight - this.diagram.inset_padding) + rel_cord.y
    );
  }

  const on_scroll = pos => {
    this.diagram.set_translation(pos.x, pos.y);
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