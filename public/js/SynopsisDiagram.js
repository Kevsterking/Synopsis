// --------------------------------------------------------------------

// Diagram

// --------------------------------------------------------------------

function SynopsisDiagram(parent_generator) {

    this.loaded = false;
  
    const place_procedure = (e) => {
  
      e.preventDefault();
      
      const poffs = { x: this.content.extent.x.min, y: this.content.extent.y.min };
      
      const placex = e.layerX - this.scroller.clientWidth + 100 + this.content.extent.x.min;
      const placey = e.layerY - this.scroller.clientHeight + 100 + this.content.extent.y.min;
  
      const new_node = new SynopsisNode();
      const pre_load = new_node.onload;
      
      new_node.onload = (element) => {
        
        pre_load(element);
        
        element.onclick = () => {
          const poffs = { x: this.content.extent.x.min, y: this.content.extent.y.min };
          this.content.delete(new_node);
          this.scroller.scrollLeft -= (this.content.extent.x.min - poffs.x);
          this.scroller.scrollTop -= (this.content.extent.y.min - poffs.y);
          delete new_node;
          this.update();
        }

        element.oncontentchange = (e) => {
          const poffs = { x: this.content.extent.x.min, y: this.content.extent.y.min };
          this.content.contain_extent.remove_subextent(new_node);
          new_node.update();
          this.content.contain_extent.insert_subextent(new_node);
          this.content.update();
          this.scroller.scrollLeft -= (this.content.extent.x.min - poffs.x);
          this.scroller.scrollTop -= (this.content.extent.y.min - poffs.y);
          this.update();
        }

        placeInDOM(example_content[0], element, (cont) => {

          setTimeout(() => {
            cont.style.padding = "100px";
          }, 5000);

        });

      }
  
      this.content.place(new_node, placex, placey);
  
      this.scroller.scrollLeft -= (this.content.extent.x.min - poffs.x);
      this.scroller.scrollTop -= (this.content.extent.y.min - poffs.y);
      this.update();
      
    }
  
    // Update state of diagram
    this.update = () => {
      
      if (!this.loaded) return "not_loaded";
  
      const x = (this.scroller.scrollWidth -  this.scroller.offsetWidth)  * 0.5 - this.scroller.scrollLeft;
      const y = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - this.scroller.scrollTop;
  
      //Keep scrollbar size updated
      this.container.style.padding = (this.scroller.clientHeight - 100) + "px " + (this.scroller.clientWidth - 100) + "px";
  
      // Update background translation
      this.background.setTranslation(x - this.content.element.offsetWidth * 0.5 - this.content.extent.x.min, y - this.content.element.offsetHeight * 0.5 - this.content.extent.y.min)
  
      //Update background
      this.background.update();
  
    }
  
    // Translate view of diagram
    this.setTranslation = (x, y) => {
  
      if (!this.loaded) return "not_loaded";
  
      this.scroller.scrollLeft  = (this.scroller.scrollWidth - this.scroller.offsetWidth) * 0.5 - x;
      this.scroller.scrollTop   = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - y;
      this.update();
  
    }
  
    // load procedure
    this.onload = (dom_element) => {
  
      this.element            = dom_element;
      this.scroller           = this.element.querySelector('*.diagram-dynamic-foreground'); 
      this.container          = this.element.querySelector('*.diagram-content-container');
      this.static_background  = this.element.querySelector('*.diagram-static-background');
  
      this.content    = new SynopsisContent(this.container);
      this.background = new SynopsisGrid(this.static_background);   
      
      this.container.oncontextmenu  = place_procedure;
      this.scroller.onscroll        = this.update; 
  
      this.loaded = true;
      
      this.update();
      this.setTranslation(0, 0);
  
    };
  
    placeInDOM(
      `
        <div class="diagram-root" style='z-index: 0; position: relative; display: inline-block; overflow: hidden; width: 1500px; height: 900px; background-color: rgb(51, 51, 51);'>
          <div class="diagram-static-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
          </div>
          <div class="diagram-dynamic-foreground" style='z-index: 100; overflow: scroll; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
            <div class="diagram-content-container" style='position: relative; overflow: hidden; float: left;'>
            </div>
          </div>
        </div>
      `,
      parent_generator, 
      this.onload
    );
  
  }