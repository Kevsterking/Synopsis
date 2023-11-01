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

  const update_scroll_extent = () => {
    const cx = this.diagram.dom.content.clientWidth * 0.5;
    const cy = this.diagram.dom.content.clientHeight * 0.5;
    this.scroller.extent.x.min = this.diagram.content.extent.x.min - this.diagram.padding.x + cx;
    this.scroller.extent.x.max = this.diagram.content.extent.x.max + this.diagram.padding.x - cx;
    this.scroller.extent.y.min = this.diagram.content.extent.y.min - this.diagram.padding.y + cy;
    this.scroller.extent.y.max = this.diagram.content.extent.y.max + this.diagram.padding.y - cy;
  }

  const unbind_content = () => {
    this.content?.on_extent_change.unsubscribe(update_scroll_extent);
    this.content = null;
  }

  const bind_content = content => {
    unbind_content();
    this.content = content;
    this.content.on_extent_change.subscribe(update_scroll_extent); 
    update_scroll_extent();
  }

  const on_set_content = content => {
    if (content?.spawned) {
      bind_content(content);
    } else {
      content?.on_load.subscribe(bind_content);
    }
  }

  const bind = diagram => {
    this.diagram = diagram;
    this.scroller.bind(this.diagram.dom.root, on_scroll, this.diagram.extent);
    this.diagram.on_set_content.subscribe(on_set_content); 
  }

  const unbind = () => {
    this.diagram.on_set_content.unsubscribe(on_set_content);
    unbind_content();
    this.scroller.unbind();
    this.diagram = null;
  }

  // ---------------------------------------------------------------------------

  this.bind   = bind;
  this.unbind = unbind;

}