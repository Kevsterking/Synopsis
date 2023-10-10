let testdata = null;
get_json("nodetest.json", (dat) => {testdata = dat;})

function SynopsisCoordinateSystem(content) {

  this.on_load            = new SynopsisEvent();
  this.on_resize          = new SynopsisEvent(); 
  this.on_translate       = new SynopsisEvent();
  this.on_focus_document  = new SynopsisEvent();

  this.content    = content;
  this.background = new SynopsisGrid();   

  this.selected = new Set();
  this.nodes    = new Set();

  this.extent      = new SynopsisExtent();
  this.translation = new SynopsisCoordinate();

  // ---------------------------------------------------------------------------

  let ctr_down              = false;
  let selection_move_start  = false;

  let last_move_event = null;

  let move_state = {
    drag_node: null,
    node_offset: new Map(),
    last_event: null
  };

  // ---------------------------------------------------------------------------

  const key_listen_down = e => {
    if (e.key == "Delete") delete_selected();
    else if (e.key == "Control") ctr_down = true;
    else if (e.key == 's') {
      if (ctr_down) {
        e.preventDefault();
      }
    }
  }

  const key_listen_up = e => {
    if (e.key == "Control") ctr_down = false;
  }

  const get_event_relative_pos = e => {
    const rect = this.scroller.getBoundingClientRect();
    return new SynopsisCoordinate(e.x + this.scr.position.x - rect.left, e.y + this.scr.position.y - rect.top);
  } 

  const get_event_coordinate = e => {
    const rel_cord = get_event_relative_pos(e);
    return new SynopsisCoordinate(this.content.extent.x.min - (this.scroller.clientWidth - 100) + rel_cord.x, this.content.extent.y.min - (this.scroller.clientHeight - 100) + rel_cord.y);
  }

  const clear_diagram = () => {
    this.nodes.forEach(node => node.delete());
  }

  const is_node = target => {
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
  
  const update_move = e => {

    const event_pos = get_event_coordinate(e);
    const node_offset = move_state.node_offset.get(move_state.drag_node);

    let place = new SynopsisCoordinate(event_pos.x + node_offset.x, event_pos.y + node_offset.y);

    if (ctr_down) {
      place.x = Math.round(place.x / 50) * 50;
      place.y = Math.round(place.y / 50) * 50;
    }

    place.x -= node_offset.x;
    place.y -= node_offset.y;

    move_state.node_offset.forEach((v, n) => {
      n.set_pos(place.x + v.x, place.y + v.y);
    });

    move_state.last_event = e;

  }

  const start_move = (node, e) => {

    const place = get_event_coordinate(e);

    move_state.node_offset.clear(); 
    move_state.drag_node = node; 
    
    this.selected.forEach(n => {
        move_state.node_offset.set(n, new SynopsisCoordinate(n.position.x - place.x, n.position.y - place.y));
    });

    move_state.last_event = e;

  }

  const stop_move = () => {
    move_state.drag_node = null; 
  }

  const node_load = node => {
    
    return element => {
      
      let last_mousedown_time = Date.now();
      let cancel_dbkclick = false;

      element.addEventListener("mousemove", () => {
        cancel_dbkclick = true;
      });

      element.addEventListener("mousedown", e => {

        e.preventDefault();

        select_node(node);

        if (e.button != 0) {
          return;
        }

        if (Date.now() - last_mousedown_time < 500 && !cancel_dbkclick) {
          //this.load_content(prop);
          return;
        }

        if (this.selected.has(node)) {
          start_move(node, e);
        }

        last_mousedown_time = Date.now();
        cancel_dbkclick = false;

      });

    }
  } 

  const spawn_node = node => {

    node.on_load.subscribe(node_load(node));
    
    this.nodes.add(node);

    node.on_delete.subscribe(() => {
      this.nodes.delete(node);
    });

    this.content.spawn_node(node);

  }

  const create_node = e => {
  
    e.preventDefault();
    
    const new_node = new SynopsisNode();
    const place_cord = get_event_coordinate(e);

    new_node.position.x = place_cord.x;
    new_node.position.y = place_cord.y;
    
    new_node.content = "<div style=\"color: white; background-color: gray;padding: 15px\">Node</div>";

    spawn_node(new_node);

  }

  // ---------------------------------------------------------------------------

  this.on_resize.subscribe(() => {
    this.update();
  });
  
  this.on_load.subscribe(element => {
    
    this.element            = element;

    this.scroller           = this.element.querySelector('*.diagram-dynamic-foreground'); 
    this.container          = this.element.querySelector('*.diagram-content-container');
    this.dynamic_foreground = this.element.querySelector('*.diagram-dynamic-foreground');
    this.static_background  = this.element.querySelector('*.diagram-static-background');

    this.scr = new SynopsisScroll(this.scroller);
    
    this.content.spawn(this.container);
    this.background.spawn(this.static_background);

    this.content.on_extent_change.subscribe(extent_change);

    synopsis_resize_observer.observe(this.element, this.on_resize.trigger);

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
      window.addEventListener("keydown", key_listen_down);
      window.addEventListener("keyup", key_listen_up);
    });

    element.addEventListener("mousemove", e => {
      if (move_state.drag_node) update_move(e);
    });

    element.addEventListener("mouseup", e => {
      if (e.button != 0) return;
      if (move_state.drag_node) stop_move();
    });

    element.addEventListener("mouseleave", e => {
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
    
    element.addEventListener("drop", e => {
      e.preventDefault();
      console.log(e);
      console.log(e.dataTransfer.files[0]);
      
    });

    this.container.oncontextmenu  = (e) => {
      e.preventDefault();
      if (!is_node(e.target)) {
        create_node(e);
      }
    }
        
    this.scr.on_scroll.subscribe(() => {
      this.update_translation();
      drag_update(last_move_event);
    });

    this.update();
    this.set_translation(0, 0);
    
  });

  // ---------------------------------------------------------------------------

  this.get_relative_mouse_pos = get_event_relative_pos;

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

    this.set_translation(0, 0);

  }

  // Update state of diagram
  this.update = () => {
    this.update_size();
    this.update_scroll_pos();
  }

  this.update_size = () => {
    this.container.style.padding = (this.scroller.clientHeight - 100) + "px " + (this.scroller.clientWidth - 100) + "px";
  }

  // Get scroll pos based on translation
  this.update_scroll_pos = () => {
   
    const paddingx = (this.scroller.clientWidth - 100);
    const paddingy = (this.scroller.clientHeight - 100);
    const cx = this.dynamic_foreground.clientWidth * 0.5;
    const cy = this.dynamic_foreground.clientHeight * 0.5;

    const scr_x = paddingx - this.content.extent.x.min - cx - this.translation.x;
    const scr_y = paddingy - this.content.extent.y.min - cy - this.translation.y;

    this.scr.set_position(scr_x, scr_y);

  }

  // Get translation based on scrollLeft
  this.update_translation = () => {
    
    const paddingx = (this.scroller.clientWidth - 100);
    const paddingy = (this.scroller.clientHeight - 100);
    const cx = this.dynamic_foreground.clientWidth * 0.5;
    const cy = this.dynamic_foreground.clientHeight * 0.5;

    this.translation.x = paddingx - this.content.extent.x.min - cx - this.scr.position.x;
    this.translation.y = paddingy - this.content.extent.y.min - cy - this.scr.position.y; 

    this.background.set_translation(this.translation.x, this.translation.y);

    
  }

  this.set_translation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    this.background.set_translation(this.translation.x, this.translation.y);
    this.update_scroll_pos();
  }
  
  this.spawn = parent_generator => {

    place_in_dom(
      `
        <div class="diagram-root" style='z-index: 0; position: relative; display: block; overflow: hidden; width: 100%; height: 100%; background-color: #242424;'>
          <div class="diagram-static-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
          </div>
          <div class="diagram-dynamic-foreground" style='z-index: 100; overflow: hidden; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
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