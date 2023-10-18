const null_container = new SynopsisNodeContainer();

function SynopsisCoordinateSystem() {

  this.on_load            = new SynopsisEvent();
  this.on_resize          = new SynopsisEvent(); 
  this.on_translate       = new SynopsisEvent();
  
  this.content    = null;
  
  this.background = new SynopsisGrid();   
  this.scroller   = new SynopsisScroller();

  this.padding          = new SynopsisCoordinate(); 
  this.translation      = new SynopsisCoordinate();
  this.scroll_position  = new SynopsisCoordinate();

  // ---------------------------------------------------------------------------

  const inset_padding = 100;

  // ---------------------------------------------------------------------------

  const get_event_relative_pos = e => {
    const rect = this.content_dom.getBoundingClientRect();
    return new SynopsisCoordinate(e.x + this.scroll_position.x - rect.left, e.y + this.scroll_position.y - rect.top);
  } 

  const get_event_coordinate = e => {
    const rel_cord = get_event_relative_pos(e);
    return new SynopsisCoordinate(this.content.extent.x.min - (this.content_dom.clientWidth - inset_padding) + rel_cord.x, this.content.extent.y.min - (this.content_dom.clientHeight - inset_padding) + rel_cord.y);
  }

  const update_size = () => {
    const cx = this.content_dom.clientWidth * 0.5;
    const cy = this.content_dom.clientHeight * 0.5;
    this.padding.x = this.content_dom.clientWidth - inset_padding;
    this.padding.y = this.content_dom.clientHeight - inset_padding;
    this.scroller.extent.x.min = this.content?.extent.x.min - this.padding.x + cx;
    this.scroller.extent.x.max = this.content?.extent.x.max + this.padding.x - cx;
    this.scroller.extent.y.min = this.content?.extent.y.min - this.padding.y + cy;
    this.scroller.extent.y.max = this.content?.extent.y.max + this.padding.y - cy;
    this.content_container.style.padding = this.padding.y + "px " + this.padding.x + "px";
  }

  const update_translation = () => {
    const cx = this.content_dom.clientWidth * 0.5;
    const cy = this.content_dom.clientHeight * 0.5;
    const scr_x = this.padding.x - this.content?.extent.x.min - cx - this.translation.x;
    const scr_y = this.padding.y - this.content?.extent.y.min - cy - this.translation.y;
    this.background.set_translation(this.translation.x, this.translation.y);
    this.content_dom.scrollLeft = this.scroll_position.x = scr_x;
    this.content_dom.scrollTop = this.scroll_position.y = scr_y;
  }

  const set_translation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    update_translation();
  }

  const on_scroll = position => {
    set_translation(-position.x, -position.y);
  }

  const full_update = () => {
    update_size();
    update_translation();
  }

  const set_content = content => {
    move_to_void_dom(this.content.element);
    this.content = content;
    this.content_container.appendChild(content.element);
    this.content.on_extent_change.subscribe(full_update);
    full_update();
  }

  const load = element => {

    const background_container = element.querySelector("div.synopsis-coordinate-system-background");
    this.content_dom = element.querySelector("div.synopsis-coordinate-system-content");
    this.content_container = element.querySelector("div.synopsis-coordinate-system-content-container");

    this.scroller.bind(this.content_dom, on_scroll, false);
    this.background.spawn(background_container);

    synopsis_resize_observer.observe(element, this.on_resize.trigger);

    set_content(null_container);

  };

  // ---------------------------------------------------------------------------

  this.on_resize.subscribe(full_update);
  this.on_load.subscribe(load);

  // ---------------------------------------------------------------------------

  this.get_relative_mouse_pos = get_event_relative_pos;
  this.get_event_coordinate   = get_event_coordinate;

  this.set_content = set_content;

  this.set_translation = (x, y) => {
    this.scroller.set_position_no_event(x, y);
    set_translation(x, y);
  }
  
  this.spawn = parent_generator => {
    place_in_dom(
      `
        <div class="synopsis-coordinate-system" style="position:relative;width:100%;height:100%;">
          <div class="synopsis-coordinate-system-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
          </div>
          <div class="synopsis-coordinate-system-content" style='z-index: 100; overflow: hidden; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
              <div class="synopsis-coordinate-system-content-container" style="width:fit-content;">
              </div>
          </div>
        </div>
      `,
      parent_generator, 
      this.on_load.trigger
    );
  };

}