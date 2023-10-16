function SynopsisNode() {

  this.on_load   = new SynopsisEvent();
  this.on_resize = new SynopsisEvent(); 
  this.on_move   = new SynopsisEvent();  
  this.on_delete = new SynopsisEvent();
  this.on_double_click = new SynopsisEvent();

  this.position = new SynopsisCoordinate();
  this.extent   = new SynopsisExtent();

  this.html = "";

  // --------------------------------------------------------------------

  const relative_extent = new SynopsisExtent();

  // --------------------------------------------------------------------

  const set_position = (x, y) => {
    this.position.x = x;
    this.position.y = y;
  }

  const _delete = () => {
    synopsis_resize_observer.stop_observing(this.element);
    this.on_delete.trigger();
    this.element.remove();
  }

  const update_relative_extent = () => {
    relative_extent.x.min = -this.element.offsetWidth * 0.5;
    relative_extent.y.min = -this.element.offsetHeight * 0.5;
    relative_extent.x.max = -relative_extent.x.min;
    relative_extent.y.max = -relative_extent.y.min;
  }

  const update_extent = () => {
    this.extent.x.min = this.position.x + relative_extent.x.min;
    this.extent.x.max = this.position.x + relative_extent.x.max;
    this.extent.y.min = this.position.y + relative_extent.y.min;
    this.extent.y.max = this.position.y + relative_extent.y.max;
  }

  const update_position = () => {
    this.element.style.left = (this.position.x + relative_extent.x.min) + "px"; 
    this.element.style.top = (this.position.y + relative_extent.y.min) + "px";
  }

  const load = element => {
    
    this.element = element;
  
    synopsis_resize_observer.observe(this.element, this.on_resize.trigger);
  
    update_relative_extent();
    update_position();
    update_extent();

    let last_mousedown_time = Date.now();
    let cancel_dbkclick = false;

    element.addEventListener("mousemove", () => {
      cancel_dbkclick = true;
    });

    element.addEventListener("mousedown", e => {

      if (e.button != 0) {
        return;
      }

      if (Date.now() - last_mousedown_time < 500 && !cancel_dbkclick) {
        this.on_double_click.trigger(e);      
        return;
      }

      last_mousedown_time = Date.now();
      cancel_dbkclick = false;

    });

  }

  // --------------------------------------------------------------------

  this.on_load.subscribe(load);

  this.on_resize.subscribe(() => {
    update_relative_extent();
    update_position();
    update_extent();
  });
  
  this.on_move.subscribe(() => {
    update_position();
    update_extent();
  });

  // --------------------------------------------------------------------

  this.delete = _delete;

  this.set_pos = (x, y) => {
    set_position(x, y);
    this.on_move.trigger();
  }

  this.highlight = () => {
    this.element.firstElementChild.style.filter = "drop-shadow(1px 1px 0 red) drop-shadow(-1px -1px 0 red)";
  }

  this.dehighlight = () => {
    this.element.firstElementChild.style.filter = "none";
  }

  this.spawn = parent_generator => {
    place_in_dom(
      `
        <div class='synopsis-node' style='user-select: none;white-space: nowrap; position: absolute;cursor: pointer;'>
        ` + this.html + `
        </div>
      `,
      parent_generator, 
      this.on_load.trigger
    );
  }


}


