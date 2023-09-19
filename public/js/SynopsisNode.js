// --------------------------------------------------------------------

// Node

// --------------------------------------------------------------------

function SynopsisNode() {

  const resize_observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      entry.target.onresize ? entry.target.onresize(entry) : 0;
    }
  });

  const relative_extent = { x: { min: null, max: null }, y: { min: null, max: null } };

  const domstr = (
    `
      <div class='synopsis-node' style='user-select: none;white-space: nowrap; position: absolute;cursor: pointer;'>
      </div>
    `
  );

  this.loaded = false;

  this.x = 0;
  this.y = 0;

  this.get_extent = () => {
    return { x: { min: this.x + relative_extent.x.min, max: this.x + relative_extent.x.max }, y: { min: this.y + relative_extent.y.min, max: this.y + relative_extent.y.max }};
  }

  this.on_load   = new SynopsisEvent();
  this.on_resize = new SynopsisEvent(); 
  this.on_move   = new SynopsisEvent();  
  this.on_delete = new SynopsisEvent();

  this.on_load.subscribe((element) => {
    // Element has loaded
    debug("[Node] - node load");
    this.element = element;
    resize_observer.observe(this.element);
    this.element.onresize = this.on_resize.trigger; 
    this.loaded = true;
    this.on_resize.trigger();
    this.on_move.trigger();
  });

  this.on_resize.subscribe(() => {
    // Recalculate relative extent, box center positioning
    debug("[Node] - node resize");
    relative_extent.x.min = -this.element.offsetWidth * 0.5;
    relative_extent.y.min = -this.element.offsetHeight * 0.5;
    relative_extent.x.max = -relative_extent.x.min;
    relative_extent.y.max = -relative_extent.y.min;
    this.on_move.trigger();
  });

  this.on_move.subscribe(() => {
    // Set style according to this.x, this.y positon
    debug("[Node] - node move");
    this.element.style.left = (this.x + relative_extent.x.min) + "px"; 
    this.element.style.top = (this.y + relative_extent.y.min) + "px";
  });

  this.spawn = (parent_generator, x, y) => {
    placeInDOM(domstr, parent_generator, (el) => {
      this.on_load.trigger(el);
      this.set_pos(x, y);
    });
  }

  this.delete = () => {
    resize_observer.disconnect();
    this.on_delete.trigger();
    this.element.remove();
  }

  this.set_pos = (x, y) => {
    this.x = x;
    this.y = y;
    this.on_move.trigger();
  }

  this.highlight = () => {
    //this.element.style.outline = "1px solid red";
    //console.log(this.element, this.element.firstElementChild);
    this.element.firstElementChild.style.filter = "drop-shadow(1px 1px 0 red) drop-shadow(-1px -1px 0 red)";
  }

  this.dehighlight = () => {
  //  this.element.style.outline = "none";
    this.element.firstElementChild.style.filter = "none";
  }


}


