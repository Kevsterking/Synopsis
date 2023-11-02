function SynopsisScopeController() {

  SynopsisBindManager.call(this);

  this.scope_bind_manager = new SynopsisBindManager();
  this.scope_bind_manager_id = null;

  const pf = this.scope_bind_manager.unbind;
  this.scope_bind_manager.unbind = () => {
    console.log("unbinding", new Error());
    pf();
  }

  this.document_interface = null;
  this.diagram            = null;
  this.scope              = null;

  this.nodes = new Map();

  // ---------------------------------------------------------------------------

  let selected = new Set();

  let move_state = {
    drag_node: null,
    node_offset: new Map(),
    last_event: null
  };

  let control_pressed = false;
  let listening_for_mouseup = false;
  let listening_for_move    = false;

  // ---------------------------------------------------------------------------

  const reset_state = () => {

    move_state.drag_node = null;
    move_state.node_offset.clear();
    move_state.last_event = null;

    listening_for_mouseup = false;
    listening_for_move = false;

  }

  const get_event_relative_pos = e => {
    const rect = this.diagram.dom.content.getBoundingClientRect();
    return new SynopsisCoordinate(e.x + this.diagram.scroll_position.x - rect.left, e.y + this.diagram.scroll_position.y - rect.top);
  }

  const get_event_coordinate = e => {
    const rel_cord = get_event_relative_pos(e);
    return new SynopsisCoordinate(
      this.diagram.content.extent.x.min - (this.diagram.dom.content.clientWidth - this.diagram.inset_padding) + rel_cord.x,
      this.diagram.content.extent.y.min - (this.diagram.dom.content.clientHeight - this.diagram.inset_padding) + rel_cord.y
    );
  }

  const key_listen_down = e => {
    if (e.key == "Delete") delete_selected();
    else if (e.key == "Control") control_pressed = true;
  }

  const key_listen_up = e => {
    if (e.key == "Control") control_pressed = false;
  }

  const clear_selection = () => {

    for (const node of selected) {
      node.dehighlight();
    }

    selected.clear();

  }

  const drag_selected_init = e => {

    const place = get_event_coordinate(e);

    move_state.node_offset.clear();
    move_state.drag_node = listening_for_move;

    selected.forEach(n => {
      move_state.node_offset.set(n, new SynopsisCoordinate(n.position.x - place.x, n.position.y - place.y));
    });

    move_state.last_event = e;

  }

  const drag_selected = e => {
    
    if (!move_state.drag_node && !listening_for_move) {
      return;
    } else if (!move_state.drag_node) {
      drag_selected_init(e);
    }

    const event_pos   = get_event_coordinate(e);
    const node_offset = move_state.node_offset.get(move_state.drag_node);

    let place = new SynopsisCoordinate(event_pos.x + node_offset.x, event_pos.y + node_offset.y);

    if (control_pressed) {
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

  const select_node = node => {
    selected.add(node);
    node.highlight();
  } 

  const deselect_node = node => {
    selected.delete(node);
    node.dehighlight();
  }

  const node_mousedownup = node => {

    if (control_pressed) {
      if (selected.has(node)) {
        deselect_node(node);
      } else {
        select_node(node);
      }
    } else {
      clear_selection();
      select_node(node);
    }

  }

  const node_mouseup = node => {

    return e => {
      
      e.stopPropagation();

      if (listening_for_mouseup) {
        node_mousedownup(node);
        listening_for_mouseup = false;
      }

      if (listening_for_move) {
        listening_for_move = false;
        move_state.drag_node = null;
      }


    }

  }

  const node_mousedown = node => {
    
    return e => {

      e.stopPropagation();

      listening_for_move = node;

      if (selected.has(node)) {
        listening_for_mouseup = true;
      } else {
        node_mousedownup(node);
      }

    }
  
  }

  const node_open = node => {
    return () => {
      this.document_interface.load_scope(this.document_interface.active_scope.get_scope(node));
    }
  }

  const content_mousedown = e => {
    !control_pressed ? clear_selection() : 0;
  }

  const content_mousemove = e => {
    if (listening_for_move) {
      drag_selected(e);
    }
  }

  const bind_node = node => {

    const node_controller = new SynopsisNodeController(node);
    const mouseupf = node_mouseup(node);
    
    console.log("bind node");

    this.scope_bind_manager.add_bind(node_controller.on_mouse_down.subscribe, node_controller.on_mouse_down.unsubscribe, node_mousedown(node));
    this.scope_bind_manager.add_bind(node_controller.on_mouse_up.subscribe, node_controller.on_mouse_up.unsubscribe, mouseupf);
    this.scope_bind_manager.add_bind(node_controller.on_double_click.subscribe, node_controller.on_double_click.unsubscribe, node_open(node));
    this.scope_bind_manager.add_bind(window.addEventListener, window.removeEventListener, ["mouseup", mouseupf]);
    this.scope_bind_manager.add_bind((k, v) => this.nodes.set(k, v), k =>  this.nodes.delete(k), [node, node_controller], node);
  
  }

  const bind_scope = scope => {

    if (this.scope_bind_manager_id) this.remove_bind(this.scope_bind_manager_id);
    this.scope_bind_manager_id = this.add_bind(() => { }, () => this.scope_bind_manager.unbind());
    
    this.scope_bind_manager.add_bind(() => { this.scope = scope },                      () => {});
    this.scope_bind_manager.add_bind(() => {}, () => reset_state());
    this.scope_bind_manager.add_bind(() => this.scope.on_add_node.subscribe(bind_node), () => this.scope.on_add_node.unsubscribe(bind_node));

    scope.nodes.forEach((_, node) => { bind_node(node) });

    this.scope_bind_manager.add_bind(() => {}, () => { this.scope = null });

  }

  const bind = document_interface => {
    this.unbind();
    this.add_bind(() => { this.diagram = document_interface.diagram; }, () => { this.diagram = null }, null);
    this.add_bind(() => { this.document_interface = document_interface; }, () => { this.document_interface = null }, null);
    this.add_bind(this.document_interface.on_load_scope.subscribe, this.document_interface.on_load_scope.unsubscribe, bind_scope);
    this.add_bind(this.document_interface.dom.content.addEventListener, this.document_interface.dom.content.removeEventListener, ["mousedown", content_mousedown]);
    this.add_bind(this.document_interface.dom.content.addEventListener, this.document_interface.dom.content.removeEventListener, ["mousemove", content_mousemove]);
    this.add_bind(window.addEventListener, window.removeEventListener, ["keydown", key_listen_down]);
    this.add_bind(window.addEventListener, window.removeEventListener, ["keyup", key_listen_up]);
  } 

  // ---------------------------------------------------------------------------

  this.bind = bind; 
  
  this.update_drag = () => { drag_selected(move_state.last_event); };

}