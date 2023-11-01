function SynopsisNodeContainer() {

  SynopsisComponent.call(this);

  this.extent = new SynopsisContainExtent();  

  this.on_add_node      = new SynopsisEvent();
  this.on_extent_change = this.extent.on_change;

  this.dom = {
    root: null,
    translator: null
  }
  
  // ---------------------------------------------------------------------------

  const add_node = node => {

    node.on_load.subscribe(() => {
      this.extent.insert_subextent(node.extent);
    });

    node.on_resize.subscribe(() => {
      this.extent.update_subextent(node.extent);
    });

    node.on_move.subscribe(() => {
      this.extent.update_subextent(node.extent);
    });

    node.on_delete.subscribe(() => {
      this.extent.remove_subextent(node.extent);
    });

    node.spawn(this.dom.translator);

    this.on_add_node.trigger(node);

  }

  const update_size = () => {
    this.dom.root.style.width  = (this.extent.x.max - this.extent.x.min) + "px";
    this.dom.root.style.height = (this.extent.y.max - this.extent.y.min) + "px";
  }

  const update_translation = () => {
    this.dom.translator.style.top   = -this.extent.y.min + "px";
    this.dom.translator.style.left  = -this.extent.x.min + "px";
  }

  const update = () => {
    update_size();
    update_translation();
  }

  const load = element => {
    this.dom.root = element;
    this.dom.translator = this.dom.root.querySelector('*.diagram-nodes-translator');
  }

  // ---------------------------------------------------------------------------

  this.on_load.subscribe(load);
  this.on_extent_change.subscribe(update);

  // ---------------------------------------------------------------------------

  this.add_node = add_node;

  this.get_dom_string = () => {
    return `
      <div class="diagram-nodes" style="box-sizing: content-box;position:relative;border: 1px solid white;">
        <div class="diagram-nodes-translator" style="position:absolute;width: 0;">
        </div>
      </div>
    `;
  }
  
}