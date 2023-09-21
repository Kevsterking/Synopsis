// --------------------------------------------------------------------

// Diagram

// --------------------------------------------------------------------

let testdata = null;

get_json("nodetest.json", (dat) => {testdata = dat;})

function SynopsisDiagram(workspace) {

  this.loaded = false;

  this.on_load            = new SynopsisEvent();
  this.on_resize          = new SynopsisEvent(); 
  this.on_translate       = new SynopsisEvent();
  this.on_focus_document  = new SynopsisEvent();

  this.workspace = workspace;

  this.background = new SynopsisGrid(this);   

  this.selected = new Set();
  this.nodes    = new Set();

  this.translation = { x: 0, y: 0 };

  this.document = {};
  this.focused_document = this.document;

  let prev_extent = { x: { min: null, max: null }, y: { min: null, max: null}}

  let ctr_down              = false;
  let selection_move_start  = false;

  let last_move_event = null;

  const resize_observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      entry.target.onresize ? entry.target.onresize(entry) : 0;
    }
  });

  const clear_diagram = () => {
    this.nodes.forEach(node => node.delete());
  }

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
    
    debug("[Diagram] - extent change");
    
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
        this.selected.add(node);
      }
  
    } 
    else if (this.selected.has(node)) {
  
    } else {
      
      this.selected.forEach(k => k.dehighlight());
      this.selected.clear();
      node.highlight();
      this.selected.add(node);
    
    }
  
  }
  
  const delete_selected = () => {
    this.selected.forEach(k => k.delete());
    this.selected.clear();
  }
  
  const node_load = (node, prop) => {
    
    debug("[Diagram] - node load");
    
    return element => {
      
      let last_mousedown_time = Date.now();
      let cancel_dbkclick = false;

      element.addEventListener("mousemove", () => {
        cancel_dbkclick = true;
      });

      element.addEventListener("mousedown", (e) => {

        e.preventDefault();

        select_node(node);

        if (e.button != 0) {
          return;
        }

        if (Date.now() - last_mousedown_time < 500 && !cancel_dbkclick) {
          this.load_content(prop);
          return;
        }

        if (this.selected.has(node)) {
          
          const place_cord = this.get_relative_mouse_pos(e);
          const placex = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
          const placey = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
          
          selection_move_start = {};
          selection_move_start.toffs = { x: node.x - placex, y: node.y - placey };
          selection_move_start.pmap = new Map();

          this.selected.forEach(k => {
            selection_move_start.pmap.set(k, { ox: k.x - placex, oy: k.y - placey });
          });

        }

        last_mousedown_time = Date.now();
        cancel_dbkclick = false;

      });

      placeInDOM(prop.html, element, null);
  
    }
  } 
  
  const drag_update = (e) => {

    if (selection_move_start) {

      const place_cord = this.get_relative_mouse_pos(e);
      let placex = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
      let placey = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
      
      const toffs = selection_move_start.toffs;

      if (ctr_down) {
        placex = Math.round((placex + toffs.x) / 50) * 50 - toffs.x;
        placey = Math.round((placey + toffs.y) / 50) * 50 - toffs.y;
      }

      selection_move_start.pmap.forEach((v, k) => {
        k.set_pos(placex + v.ox, placey + v.oy);
      });

    }
  
  }

  const place_node = (node, prop) => {
  
    node.on_load.subscribe(node_load(node, prop));
    
    this.nodes.add(node);
    
    node.on_delete.subscribe(() => {
      this.nodes.delete(node);
    });

    this.content.place(node, prop.x, prop.y);

  }

  const place_procedure = (e) => {
  
    e.preventDefault();
  
    const prop = {};
    const new_node = new SynopsisNode();
    const place_cord = this.get_relative_mouse_pos(e);
  
    prop.x = place_cord.x - this.scroller.clientWidth + 100 + this.content.extent.x.min;
    prop.y = place_cord.y - this.scroller.clientHeight + 100 + this.content.extent.y.min;
    prop.html = "<div style=\"color: white; background-color: gray;padding: 15px\">Node</div>";
  
    place_node(new_node, prop);
  
  }

  this.get_relative_mouse_pos = (e) => {
    const rect = this.scroller.getBoundingClientRect();
    return { x: e.x + this.scroller.scrollLeft - rect.left, y: e.y + this.scroller.scrollTop - rect.top};
  } 

  this.on_resize.subscribe(() => {
    this.update();
  });
  
  this.on_load.subscribe((element) => {
    
    resize_observer.observe(element);
    element.onresize = this.on_resize.trigger;

    const key_listen_down = (e) => {
      if (e.key == "Delete") delete_selected();
      else if (e.key == "Control") ctr_down = true;
      else if (e.key == 's') {
        if (ctr_down) {
          e.preventDefault();
        }
      }
      //  else console.log(e.key);
    }

    const key_listen_up = (e) => {
      if (e.key == "Control") ctr_down = false;
    }

    element.addEventListener("wheel", (e) => {

      if (ctr_down) {
        e.preventDefault();
        if (e.deltaY < 0) this.content.scale_by(1.1);
        else this.content.scale_by(1 / 1.1);
      }
      
    });

    element.addEventListener("mousedown", (e) => {

      if (!is_node(e.target) && !ctr_down) {
        this.selected.forEach(k => k.dehighlight());
        this.selected.clear();
      }

    });

    element.addEventListener("mouseenter", () => {
      //console.log("mouse leave");
      window.addEventListener("keydown", key_listen_down);
      window.addEventListener("keyup", key_listen_up);
    });

    element.addEventListener("mousemove", (e) => {
      last_move_event = e;
      drag_update(e);
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

    element.addEventListener("dragenter", e => e.preventDefault());
    element.addEventListener("dragleave", e => e.preventDefault());
    element.addEventListener("dragover", e => {
      e.preventDefault();
      for (const file of e.dataTransfer.files) {
        console.log(file);
      }
    });
    
    element.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(e);
      console.log(e.dataTransfer.files[0]);
      
    });

    // load procedure
    this.element            = element;

    this.scroller           = this.element.querySelector('*.diagram-dynamic-foreground'); 
    this.container          = this.element.querySelector('*.diagram-content-container');
    this.static_background  = this.element.querySelector('*.diagram-static-background');

    this.content    = new SynopsisContent(this.container);
    
    this.content.on_extent_change.subscribe(extent_change);

    this.container.oncontextmenu  = (e) => {
      e.preventDefault();
      if (!is_node(e.target)) {
        place_procedure(e);
      }
    }
    
    this.scroller.onscroll = (e) => {

      this.update(e); 
      drag_update(last_move_event);

    }

    this.loaded = true;
    
    this.update();
    this.setTranslation(0, 0);
    
  });

  this.load_content = (json) => {
    
    clear_diagram();
    
    this.document = json;
    this.focused_document = this.document; 

    if (json.nodes) {
      for (const node of json.nodes) {
        place_node(new SynopsisNode(), node);
      }
    }

    this.on_focus_document.trigger(json);

    this.setTranslation(0, 0);

  }

  // Update state of diagram
  this.update = () => {

    const x = (this.scroller.scrollWidth -  this.scroller.offsetWidth)  * 0.5 - this.scroller.scrollLeft;
    const y = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - this.scroller.scrollTop;

    this.translation.x = x - this.content.element.offsetWidth * 0.5 - this.content.extent.x.min;
    this.translation.y = y - this.content.element.offsetHeight * 0.5 - this.content.extent.y.min;
    
    this.on_translate.trigger({ x: this.translation.x, y: this.translation.y });

    //Keep scrollbar size updated
    this.container.style.padding = (this.scroller.clientHeight - 100) + "px " + (this.scroller.clientWidth - 100) + "px";

  }

  // Translate view of diagram
  this.setTranslation = (x, y) => {
    this.scroller.scrollLeft  = (this.scroller.scrollWidth - this.scroller.offsetWidth) * 0.5 - x;
    this.scroller.scrollTop   = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - y;
    this.update();
  }
  
  this.spawn = parent_generator => {

    placeInDOM(
      `
        <div class="diagram-root" style='z-index: 0; position: relative; display: inline-block; overflow: hidden; width: 100%; height: 100%; background-color: rgb(41, 41, 41);'>
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

  };

}