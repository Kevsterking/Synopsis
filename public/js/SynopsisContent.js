// --------------------------------------------------------------------

// Content

// --------------------------------------------------------------------

function SynopsisContent(parent_generator) {

  const resize_observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      entry.target.oncontentchange(entry);
    }
  });

  this.loaded = false;

  this.extent = null;
  this.contain_extent = new SynopsisContainExtent();  

  this.update = () => {

    this.extent = this.contain_extent.get_extent();

    this.translator.style.transform = "translate(" + (-this.extent.x.min) + "px, " + (-this.extent.y.min) + "px)";

    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";

  }

  this.delete = (node) => {
    this.contain_extent.remove_subextent(node);
    resize_observer.disconnect(node.element);
    node.element.outerHTML = "";
    delete node.element;
    delete node;
    this.update();
  }

  this.place = (node, x, y) => {
    
    placeInDOM(node.dom_str, this.translator, (element) => {
      
      element.oncontentchange = (e) => {
        this.contain_extent.remove_subextent(node);
        node.update();
        this.contain_extent.insert_subextent(node);
        this.update();
      }

      resize_observer.observe(element);

      node.onload(element);

      node.setPos(x, y);
      node.update();
      
      this.contain_extent.insert_subextent(node);
  
      this.update();

    });

  }

  this.onload = (dom_element) => {

    this.element    = dom_element;
    this.translator = this.element.querySelector('*.diagram-nodes-translator');

    this.extent = this.contain_extent.get_extent();

    this.loaded = true;

  };

  placeInDOM(
    `
      <div class="diagram-nodes" style='border: 1px solid white'>
        <div class="diagram-nodes-translator">
        </div>
      </div>
    `,
    parent_generator,
    this.onload
  );

}