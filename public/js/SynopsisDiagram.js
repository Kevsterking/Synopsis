// --------------------------------------------------------------------

// Diagram

// --------------------------------------------------------------------

function SynopsisDiagram(parent_generator) {

    this.loaded = false;

    this.selected = new Map();

    let prev_extent = { x: { min: 0, max: 0}, y: { min: 0, max: 0 }};

    let ctr_down = false;

    const extent_change = () => {
      
      console.log("[Diagram] - extent change");
      
      const new_extent = this.content.extent;
      
      this.scroller.scrollLeft -= (new_extent.x.min - prev_extent.x.min);
      this.scroller.scrollTop -= (new_extent.y.min - prev_extent.y.min);
      
      prev_extent = new_extent;

      this.update();
      
    }

    const select_node = (node) => {
      
      if (ctr_down) {
        
        if (this.selected.has(node)) {
          node.dehighlight();
          this.selected.delete(node);
        } else {
          node.highlight();
          this.selected.set(node, true);
        }

      } else {
        
        this.selected.forEach((_, k) => k.dehighlight());
        this.selected.clear();
        node.highlight();
        this.selected.set(node, true);
      
      }
    
    }

    const delete_selected = () => {
      this.selected.forEach((v, k) => k.delete());
      this.selected.clear();
    }

    const node_load = (node) => {
      
      console.log("[Diagram] - node load");

      return (element) => {
        
        element.onmousedown = (e) => {
          e.preventDefault();
          select_node(node);
          //node.delete();
        }

        const idx = Math.floor(Math.random()*example_content.length);
        placeInDOM(example_content[idx], element, (cont) => {
          if (!idx) {
            setTimeout(() => {
              cont.style.padding = "100px";
            }, 5000);
          }
        });

      }
    } 

    const place_procedure = (e) => {
  
      e.preventDefault();
            
      const placex = e.layerX - this.scroller.clientWidth + 100 + this.content.extent.x.min;
      const placey = e.layerY - this.scroller.clientHeight + 100 + this.content.extent.y.min;
  
      const new_node = new SynopsisNode();
      new_node.on_load.subscribe(node_load(new_node));
      this.content.place(new_node, placex, placey);
  
    }
    
    this.on_load = new SynopsisEvent();

    this.on_load.subscribe((element) => {
      
      const key_listen_down = (e) => {

        if (e.key == "Delete") delete_selected();
        else if (e.key == "Control") ctr_down = true;
        //  else console.log(e.key);
      }

      const key_listen_up = (e) => {
        if (e.key == "Control") ctr_down = false;
      }

      element.addEventListener("mousedown", (e) => {
        
        const is_inside_synopsis_node = any_of_parents_satisfies(e.target, (parent) => {
          try {
            return parent.classList.contains("synopsis-node");
          } catch(err) {
            return false;
          }
        });

        if (!is_inside_synopsis_node) {
          this.selected.forEach((v, k) => k.dehighlight());
          this.selected.clear();
        }
 
      });

      element.addEventListener("mouseenter", () => {
        //console.log("mouse leave");
        window.addEventListener("keydown", key_listen_down);
        window.addEventListener("keyup", key_listen_up);
      });

      element.addEventListener("mouseleave", (e) => {
        //console.log("mouse enter");
        window.removeEventListener("keydown", key_listen_down);
        window.removeEventListener("keydown", key_listen_up);
      });

      // load procedure
      this.element            = element;
      this.scroller           = this.element.querySelector('*.diagram-dynamic-foreground'); 
      this.container          = this.element.querySelector('*.diagram-content-container');
      this.static_background  = this.element.querySelector('*.diagram-static-background');
  
      this.content    = new SynopsisContent(this.container);
      this.background = new SynopsisGrid(this.static_background);   
      
      this.content.on_extent_change.subscribe(extent_change);

      this.container.oncontextmenu  = place_procedure;
      this.scroller.onscroll        = this.update; 
  
      this.loaded = true;
      
      this.update();
      this.setTranslation(0, 0);
  
    });

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
      this.on_load.trigger
    );
  
  }