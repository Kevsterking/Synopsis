// --------------------------------------------------------------------

// Content

// --------------------------------------------------------------------

function SynopsisContent(parent_generator) {

  this.loaded = false;

  this.extent = null;
  this.contain_extent   = new SynopsisContainExtent();  

  this.on_extent_change = new SynopsisEvent();
  this.on_load          = new SynopsisEvent();

  let scale = 1;
  let translate_str = "";
  let scale_str = "";

  this.scale_by = (scl) => {
    //scale *= scl;
    scale = 1;
    translate_str = "translate(" + (-1-this.extent.x.min) + "px, " + (-1-this.extent.y.min) + "px)";
    scale_str = "scale(" + scale + ")";
    this.translator.style.transform = translate_str;//scale_str + " " + translate_str;
    this.element.style.width = scale * (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = scale * (this.extent.y.max - this.extent.y.min) + "px";
    
  } 

  this.on_load.subscribe((element) => {
    debug("[Content] - content load");
    this.element    = element;
    this.translator = this.element.querySelector('*.diagram-nodes-translator');
    this.extent     = this.contain_extent.get_extent();
    this.loaded     = true;
  });

  this.on_extent_change.subscribe(() => {
    debug("[Content] - content extent change");
    this.extent = this.contain_extent.get_extent();
    translate_str = "translate(" + (-1-this.extent.x.min) + "px, " + (-1-this.extent.y.min) + "px)";
    this.translator.style.transform = translate_str; //scale_str + " " + translate_str;
    this.element.style.width = scale * (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = scale * (this.extent.y.max - this.extent.y.min) + "px";
  });

  this.place = (node, x, y) => {
      
    node.on_load.subscribe(() => {
      debug("[Content] - node load");
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_resize.subscribe(() => {
      debug("[Content] - node resize");
      this.contain_extent.remove_subextent(node);
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_move.subscribe(() => {
      debug("[Content] - node move");
      this.contain_extent.remove_subextent(node);
      this.contain_extent.insert_subextent(node);
      this.on_extent_change.trigger();
    });

    node.on_delete.subscribe(() => {
      debug("[Content] - node delete");
      this.contain_extent.remove_subextent(node);
      this.on_extent_change.trigger();
    });

    node.spawn(this.translator, x, y);
    
  }

  place_in_dom(
    `
      <div class="diagram-nodes" style="box-sizing: content-box;border:1px solid white;">
        <div class="diagram-nodes-translator" style="width: 0;">
        </div>
      </div>
    `,
    parent_generator,
    this.on_load.trigger
  );

}