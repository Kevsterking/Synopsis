// --------------------------------------------------------------------

// Content

// --------------------------------------------------------------------

function SynopsisContent(parent_generator) {

  this.loaded = false;

  this.extent = null;
  this.contain_extent   = new SynopsisContainExtent();  

  this.on_extent_change = new SynopsisEvent();
  this.on_load          = new SynopsisEvent();

  this.on_load.subscribe((element) => {
    console.log("[Content] - content load");
    this.element    = element;
    this.translator = this.element.querySelector('*.diagram-nodes-translator');
    this.extent     = this.contain_extent.get_extent();
    this.loaded     = true;
  });

  this.on_extent_change.subscribe(() => {
    console.log("[Content] - content extent change");
    this.extent = this.contain_extent.get_extent();
    this.translator.style.transform = "translate(" + (-this.extent.x.min) + "px, " + (-this.extent.y.min) + "px)";
    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";
  });

  this.place = (node, x, y) => {
      
    node.on_load.subscribe(() => {
      console.log("[Content] - node load");
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_resize.subscribe(() => {
      console.log("[Content] - node resize");
      this.contain_extent.remove_subextent(node);
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_move.subscribe(() => {
      console.log("[Content] - node move");
      this.contain_extent.remove_subextent(node);
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_delete.subscribe(() => {
      console.log("[Content] - node delete");
      this.contain_extent.remove_subextent(node);
      this.on_extent_change.trigger();
    });

    console.log("");
    console.log("[Content] - pre node spawn");
    node.spawn(this.translator, x, y);
    console.log("[Content] - post node spawn");
    console.log("");
    
  }

  placeInDOM(
    `
      <div class="diagram-nodes" style="border: 1px solid white;">
        <div class="diagram-nodes-translator">
        </div>
      </div>
    `,
    parent_generator,
    this.on_load.trigger
  );

}