let testdata = null;
get_json("nodetest.json", dat => {testdata = dat;})

function SynopsisCoordinateSystem(content) {

  this.on_load            = new SynopsisEvent();
  this.on_resize          = new SynopsisEvent(); 
  this.on_translate       = new SynopsisEvent();
  this.on_focus_document  = new SynopsisEvent();

  this.scroller = new SynopsisScroller();

  this.content    = content;
  this.background = new SynopsisGrid();   

  this.selected = new Set();
  this.nodes    = new Set();

  this.content_container = null;

  this.padding          = new SynopsisCoordinate(); 
  this.translation      = new SynopsisCoordinate();
  this.scroll_position  = new SynopsisCoordinate();

  // ---------------------------------------------------------------------------

  const inset_padding = 100;

  let ctrl_pressed = false;

  let move_state = {
    drag_node: null,
    node_offset: new Map(),
    last_event: null
  };

  // ---------------------------------------------------------------------------

  const key_listen_down = e => {
    if (e.key == "Delete") delete_selected();
    else if (e.key == "Control") ctrl_pressed = true;
    else if (e.key == 's') {
      if (ctrl_pressed) {
        e.preventDefault();
      }
    }
  }

  const key_listen_up = e => {
    if (e.key == "Control") ctrl_pressed = false;
  }

  const get_event_relative_pos = e => {
    const rect = this.content_dom.getBoundingClientRect();
    return new SynopsisCoordinate(e.x + this.scroll_position.x - rect.left, e.y + this.scroll_position.y - rect.top);
  } 

  const get_event_coordinate = e => {
    const rel_cord = get_event_relative_pos(e);
    return new SynopsisCoordinate(this.content.extent.x.min - (this.content_dom.clientWidth - inset_padding) + rel_cord.x, this.content.extent.y.min - (this.content_dom.clientHeight - inset_padding) + rel_cord.y);
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
  
  const select_node = (node) => {
    
    if (ctrl_pressed) {
      
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

    if (ctrl_pressed) {
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

  const update_size = () => {
    const cx = this.content_dom.clientWidth * 0.5;
    const cy = this.content_dom.clientHeight * 0.5;
    this.padding.x = this.content_dom.clientWidth - inset_padding;
    this.padding.y = this.content_dom.clientHeight - inset_padding;
    this.scroller.extent.x.min = this.content.extent.x.min - this.padding.x + cx;
    this.scroller.extent.x.max = this.content.extent.x.max + this.padding.x - cx;
    this.scroller.extent.y.min = this.content.extent.y.min - this.padding.y + cy;
    this.scroller.extent.y.max = this.content.extent.y.max + this.padding.y - cy;
    this.content_container.style.padding = this.padding.y + "px " + this.padding.x + "px";
  }

  const update_translation = () => {
    const cx = this.content_dom.clientWidth * 0.5;
    const cy = this.content_dom.clientHeight * 0.5;
    const scr_x = this.padding.x - this.content.extent.x.min - cx - this.translation.x;
    const scr_y = this.padding.y - this.content.extent.y.min - cy - this.translation.y;
    this.background.set_translation(this.translation.x, this.translation.y);
    this.content_dom.scrollLeft = this.scroll_position.x = scr_x;
    this.content_dom.scrollTop = this.scroll_position.y = scr_y;
  }

  const set_translation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    update_translation();
  }

  const on_scroll = position => {
    set_translation(-position.x, -position.y);
    if (move_state.drag_node) update_move(move_state.last_event);
  }

  const full_update = () => {
    update_size();
    update_translation();
  }

  // ---------------------------------------------------------------------------

  this.on_resize.subscribe(full_update);

  this.on_load.subscribe(element => {

    const background_container  = element.querySelector("div.synopsis-coordinate-system-background");
    this.content_dom            = element.querySelector("div.synopsis-coordinate-system-content");
    this.content_container      = element.querySelector("div.synopsis-coordinate-system-content-container");
    
    this.scroller.bind(this.content_dom, on_scroll, false);

    this.content.spawn(this.content_container);
    this.background.spawn(background_container);

    this.content.on_extent_change.subscribe(full_update);

    synopsis_resize_observer.observe(element, this.on_resize.trigger);

    element.addEventListener("wheel", (e) => {

      if (ctrl_pressed) {
        e.preventDefault();
        if (e.deltaY < 0) this.content.scale_by(1.1);
        else this.content.scale_by(1 / 1.1);
      }
      
    });

    element.addEventListener("mousedown", (e) => {

      if (!is_node(e.target) && !ctrl_pressed) {
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

    this.content_container.oncontextmenu  = (e) => {
      e.preventDefault();
      if (!is_node(e.target)) {
        create_node(e);
      }
    }

    full_update();
    
  });

  // ---------------------------------------------------------------------------

  this.get_relative_mouse_pos = get_event_relative_pos;

  this.load_content = json => {
    
    clear_diagram();
    
    this.document = json;
    this.focused_document = this.document; 

    if (json.nodes) {
      for (const node of json.nodes) {

        const new_node = new SynopsisNode();

        console.log(node);


        //place_node(new SynopsisNode(), node);

      }
    }

    this.on_focus_document.trigger(json);

    this.set_translation(0, 0);

  }

  this.set_translation = (x, y) => {
    this.scroller.set_position_no_event(x, y);
    set_translation(x, y);
  }
  
  this.spawn = parent_generator => {


    place_in_dom(
      `
        <div class="synopsis-coordinate-system" style="position:relative;width:100%;height:100%;">
          <div class="synopsis-coordinate-system-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
          </div>
          <div class="synopsis-coordinate-system-content" style='z-index: 100; overflow: hidden; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
              <div class="synopsis-coordinate-system-content-container" style="width:fit-content;">
              </div>
          </div>
        </div>
      `,
      parent_generator, 
      this.on_load.trigger
    );

  };

}