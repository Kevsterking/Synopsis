const null_container = new SynopsisNodeContainer();

function SynopsisCoordinateSystem() {

  SynopsisComponent.call(this);

  this.on_resize      = new SynopsisEvent(); 
  this.on_translate   = new SynopsisEvent();
  this.on_set_content = new SynopsisEvent();

  this.background       = new SynopsisGrid();   

  this.content          = null;

  this.padding          = new SynopsisCoordinate(); 
  this.translation      = new SynopsisCoordinate();
  this.scroll_position  = new SynopsisCoordinate();
  this.center           = new SynopsisCoordinate();

  this.extent           = new SynopsisExtent();

  this.inset_padding = 100;

  this.dom = {
    root: null,
    background: null,
    content: null,
    content_container: null,
  }

  // ---------------------------------------------------------------------------

  const update_size = () => {
    this.center.x = this.dom.content.clientWidth * 0.5;
    this.center.y = this.dom.content.clientHeight * 0.5;
    this.padding.x = this.dom.content.clientWidth - this.inset_padding;
    this.padding.y = this.dom.content.clientHeight - this.inset_padding;
    this.extent.x.min = this.content.extent.x.min - this.padding.x + this.center.x;
    this.extent.x.max = this.content.extent.x.max + this.padding.x - this.center.x;
    this.extent.y.min = this.content.extent.y.min - this.padding.y + this.center.y;
    this.extent.y.max = this.content.extent.y.max + this.padding.y - this.center.y;
    this.dom.content_container.style.padding = this.padding.y + "px " + this.padding.x + "px";
  }

  const update_translation = () => {
    this.translation.x = Math.min(Math.max(this.translation.x, this.extent.x.min), this.extent.x.max);
    this.translation.y = Math.min(Math.max(this.translation.y, this.extent.y.min), this.extent.y.max);
    const scr_x = this.translation.x + this.padding.x - this.content.extent.x.min - this.center.x;
    const scr_y = this.translation.y + this.padding.y - this.content.extent.y.min - this.center.y;
    this.background.set_translation(this.translation.x, this.translation.y);
    this.dom.content.scrollLeft = this.scroll_position.x = scr_x;
    this.dom.content.scrollTop = this.scroll_position.y = scr_y;
  }

  const set_translation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    update_translation();
  }

  const full_update = () => {
    update_size();
    update_translation();
  }

  const set_content_loaded = content => {

    if (this.content?.dom.root) {
      this.content.on_extent_change.unsubscribe(full_update);
      this.content.dom.root ? move_to_void_dom(this.content.dom.root) : 0;
    }

    this.content = content;
    this.content.on_extent_change.subscribe(full_update);
    this.dom.content_container.appendChild(this.content.dom.root);
  
    full_update();
  
    this.on_set_content.trigger(content);
  
  }

  const set_content = content => {
    if (content?.spawned) {
      set_content_loaded(content);
    } else {
      content?.spawn().then(() => set_content_loaded(content));
    }
  }

  const load = element => {
  
    this.dom.root               = element;
    this.dom.background         = element.querySelector("div.synopsis-coordinate-system-background");
    this.dom.content            = element.querySelector("div.synopsis-coordinate-system-content");
    this.dom.content_container  = element.querySelector("div.synopsis-coordinate-system-content-container");
    synopsis_resize_observer.observe(this.dom.content, this.on_resize.trigger);
    this.background.spawn(this.dom.background);
    
    set_content(null_container);
  
  };

  // ---------------------------------------------------------------------------

  this.on_resize.subscribe(full_update);
  this.on_load.subscribe(load);

  // ---------------------------------------------------------------------------

  this.set_content = set_content;

  this.set_translation = (x, y) => {
    set_translation(x, y);
    this.on_translate.trigger();
  }
  
  this.get_dom_string = () => {
    return `
      <div class="synopsis-coordinate-system" style="position:relative;width:100%;height:100%;">
        <div class="synopsis-coordinate-system-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
        </div>
        <div class="synopsis-coordinate-system-content" style='z-index: 100; overflow: hidden; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
            <div class="synopsis-coordinate-system-content-container" style="width:fit-content;">
            </div>
        </div>
      </div>
    `;
  }

}