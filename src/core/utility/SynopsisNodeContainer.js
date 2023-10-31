function SynopsisNodeContainer() {

  this.extent = new SynopsisContainExtent();  

  this.on_load          = new SynopsisEvent();
  this.on_add_node      = new SynopsisEvent();
  this.on_extent_change = this.extent.on_change;

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

    node.spawn(this.translator);

    this.on_add_node.trigger(node);

  }

  const update_size = () => {
    this.element.style.width  = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";
  }

  const update_translation = () => {
    this.translator.style.top   = -this.extent.y.min + "px";
    this.translator.style.left  = -this.extent.x.min + "px";
  }

  const update = () => {
    update_size();
    update_translation();
  }

  // ---------------------------------------------------------------------------

  this.on_load.subscribe(element => {
    this.element    = element;
    this.translator = this.element.querySelector('*.diagram-nodes-translator');
  });

  this.on_extent_change.subscribe(update);

  // ---------------------------------------------------------------------------

  this.add_node = add_node;

  this.spawn = parent_generator => {
    return place_in_dom(
      `
        <div class="diagram-nodes" style="box-sizing: content-box;position:relative;border: 1px solid white;">
          <div class="diagram-nodes-translator" style="position:absolute;width: 0;">
          </div>
        </div>
      `,
      parent_generator
    ).then(this.on_load.trigger);
  }
  
}