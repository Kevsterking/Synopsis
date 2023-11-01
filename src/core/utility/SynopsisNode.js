function SynopsisNode() {

  SynopsisComponent.call(this);

  this.on_resize = new SynopsisEvent(); 
  this.on_move   = new SynopsisEvent();  
  this.on_delete = new SynopsisEvent();

  this.position = new SynopsisCoordinate();
  this.extent   = new SynopsisExtent();

  this.dom = {
    root: null,
  }

  this.html = "";

  // --------------------------------------------------------------------

  const relative_extent = new SynopsisExtent();

  // --------------------------------------------------------------------

  const set_position = (x, y) => {
    this.position.x = x;
    this.position.y = y;
  }

  const _delete = () => {
    synopsis_resize_observer.stop_observing(this.dom.root);
    this.on_delete.trigger();
    this.dom.root.remove();
  }

  const update_relative_extent = () => {
    relative_extent.x.min = -this.dom.root.offsetWidth * 0.5;
    relative_extent.y.min = -this.dom.root.offsetHeight * 0.5;
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
    this.dom.root.style.left = (this.position.x + relative_extent.x.min) + "px"; 
    this.dom.root.style.top = (this.position.y + relative_extent.y.min) + "px";
  }

  const load = element => {
  
    this.dom.root = element;
  
    synopsis_resize_observer.observe(this.dom.root, this.on_resize.trigger);
  
    update_relative_extent();
    update_position();
    update_extent();

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
    this.dom.root.firstElementChild.style.filter = "drop-shadow(1px 1px 0 red) drop-shadow(-1px -1px 0 red)";
  }

  this.dehighlight = () => {
    this.dom.root.firstElementChild.style.filter = "none";
  }

  // --------------------------------------------------------------------

  this.get_dom_string = () => {
    return `
      <div class='synopsis-node' style='user-select: none;white-space: nowrap; position: absolute;cursor: pointer;'>
      ` + this.html + `
      </div>
    `;
  }


}


