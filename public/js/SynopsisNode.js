// --------------------------------------------------------------------

// Node

// --------------------------------------------------------------------

const resize_observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.onresize ? entry.target.onresize(entry) : 0;
  }
});

function SynopsisNode() {

  const relative_extent = { x: { min: null, max: null }, y: { min: null, max: null } };

  const domstr = (
    `
      <div style='user-select: none;white-space: nowrap; position: absolute; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; cursor: pointer;'>
      </div>
    `
  );

  this.loaded = false;

  this.x = 0;
  this.y = 0;

  this.get_extent = () => {
    return { x: { min: this.x + relative_extent.x.min, max: this.x + relative_extent.x.max }, y: { min: this.y + relative_extent.y.min, max: this.y + relative_extent.y.max }};
  }

  this.onload   = new SynopsisEvent();
  this.onresize = new SynopsisEvent(); 
  this.onmove   = new SynopsisEvent();  
  this.ondelete = new SynopsisEvent();

  this.onload.subscribe((element) => {
    // Element has loaded
    console.log("[Node] - node load");
    this.element = element;
    resize_observer.observe(this.element);
    this.element.onresize = this.onresize.trigger; 
    this.loaded = true;
    this.onresize.trigger();
    this.onmove.trigger();
  });

  this.onresize.subscribe(() => {
    // Recalculate relative extent, box center positioning
    if (!this.loaded) return;
    relative_extent.x.min = -this.element.offsetWidth * 0.5;
    relative_extent.y.min = -this.element.offsetHeight * 0.5;
    relative_extent.x.max = -relative_extent.x.min;
    relative_extent.y.max = -relative_extent.y.min;
    this.onmove.trigger();
    console.log("[Node] - node resize", relative_extent.x.min, relative_extent.y.min);
    
    //console.log("updated relative extent", relative_extent);
  });

  this.onmove.subscribe(() => {
    // Set style according to this.x, this.y positon
    console.log("[Node] - node move");
    if (!this.loaded) return;
    this.element.style.left = (this.x + relative_extent.x.min) + "px"; 
    this.element.style.top = (this.y + relative_extent.y.min) + "px";
  });

  this.spawn = (parent_generator, x, y) => {
    placeInDOM(domstr, parent_generator, (el) => {
      this.onload.trigger(el);
      this.setPos(x, y);
    });
  }

  this.setPos = (x, y) => {
    this.x = x;
    this.y = y;
    this.onmove.trigger();
  }

  this.highlight = () => {
    this.element.style.outline = "1px solid red";
  }

  this.dehighlight = () => {
    this.element.style.outline = "none";
  }


}


