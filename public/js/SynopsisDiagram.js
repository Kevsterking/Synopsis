// --------------------------------------------------------------------

// Diagram

// --------------------------------------------------------------------


function SynopsisDiagram(parent_generator) {

  this.loaded = false;

  this.selected = new Map();

  let prev_extent = { x: { min: null, max: null }, y: { min: null, max: null}}

  let ctr_down              = false;
  let selection_move_start  = false;

  const is_node = (target) => {
    return any_of_parents_satisfies(target, (parent) => {
      try {
        return parent.classList.contains("synopsis-node");
      } catch(err) {
        return false;
      }
    });
  }
  
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
  
    } 
    else if (this.selected.has(node)) {
  
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
        
        if (e.button != 0) return;
        
        select_node(node);
        
        if (this.selected.has(node)) {
          
          const place_cord = this.get_relative_mouse_pos(e);
          const placex = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
          const placey = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
    
          selection_move_start = {};
          selection_move_start.pmap = new Map();

          this.selected.forEach((v, k) => {
            selection_move_start.pmap.set(k, { ox: k.x - placex, oy: k.y - placey });
          });

        }
      
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
  
    const place_cord = this.get_relative_mouse_pos(e);
    const placex = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
    const placey = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
  
    const new_node = new SynopsisNode();
    new_node.on_load.subscribe(node_load(new_node));
    this.content.place(new_node, placex, placey);
  
  }

  this.on_load = new SynopsisEvent();

  this.get_relative_mouse_pos = (e) => {
    const rect = this.scroller.getBoundingClientRect();
    return { x: e.screenX + this.scroller.scrollLeft - rect.left, y: e.screenY + this.scroller.scrollTop - rect.top - 80};
    // I dont know why but somehow we get an offset of 80 from the grid coords
  } 

  this.on_load.subscribe((element) => {
    
    const key_listen_down = (e) => {

      if (e.key == "Delete") delete_selected();
      else if (e.key == "Control") ctr_down = true;
      //  else console.log(e.key);
    }

    const key_listen_up = (e) => {
      if (e.key == "Control") ctr_down = false;
    }

    element.addEventListener("wheel", (e) => {
      if (ctr_down) {
        e.preventDefault();
        /* TODO introdce scale
        if (e.deltaY < 0) this.content.scale_by(1.1);
        else this.content.scale_by(1 / 1.1);
        */
      }
    });

    element.addEventListener("click", (e) => {

      if (!is_node(e.target) && !ctr_down) {
        this.selected.forEach((v, k) => k.dehighlight());
        this.selected.clear();
      }

    });

    element.addEventListener("mouseenter", () => {
      //console.log("mouse leave");
      window.addEventListener("keydown", key_listen_down);
      window.addEventListener("keyup", key_listen_up);
    });

    element.addEventListener("mousedown", (e) => {
      if (e.button != 0) return;
      const place_cord = this.get_relative_mouse_pos(e);
      console.log(place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min, place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min);
    });

    element.addEventListener("mousemove", (e) => {

      if (selection_move_start) {

        const place_cord = this.get_relative_mouse_pos(e);
        const placex = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
        const placey = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
  
        selection_move_start.pmap.forEach((v, k) => {
          k.set_pos(placex + v.ox, placey + v.oy);
        });

      }

    });

    element.addEventListener("mouseup", (e) => {
      if (e.button != 0) return;
      if (selection_move_start) selection_move_start = false;
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

    this.container.oncontextmenu  = (e) => {
      e.preventDefault();
      if (!is_node(e.target)) {
        place_procedure(e);
      }
    }
    
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