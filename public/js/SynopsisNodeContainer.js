function SynopsisNodeContainer() {

  this.extent = new SynopsisContainExtent();  

  this.on_load          = new SynopsisEvent();
  this.on_extent_change = this.extent.on_change;

  // ---------------------------------------------------------------------------

  const update_size = () => {
    this.element.style.width  = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";
  }

  const update_translation = () => {
    this.translator.style.top   = -this.extent.y.min + "px";
    this.translator.style.left  = -this.extent.x.min + "px";
    //this.translator.style.transform = "translate(" + (-1-this.extent.x.min) + "px, " + (-1-this.extent.y.min) + "px)";
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

  this.spawn_node = node => {
      
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
      this.extemt.remove_subextent(node.extent);
    });

    node.spawn(this.translator);

  }

  this.spawn = parent_generator => {
    place_in_dom(
      `
        <div class="diagram-nodes" style="box-sizing: content-box;position:relative;border:1px solid white;">
          <div class="diagram-nodes-translator" style="position:absolute;width: 0;">
          </div>
        </div>
      `,
      parent_generator,
      this.on_load.trigger
    );
  }
  
}