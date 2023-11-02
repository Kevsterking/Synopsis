function SynopsisController() {

  SynopsisBindManager.call(this);

  this.on_node_open = new SynopsisEvent();

  this.document_interface_controller  = new SynopsisDocumentInterfaceController();
  this.diagram_controller             = new SynopsisDiagramController();
  this.scope_controller               = new SynopsisScopeController();

  // ---------------------------------------------------------------------------

  const bind_scope_controller = document_interface => {
    this.add_bind(this.scope_controller.bind, this.scope_controller.unbind, document_interface);
  }

  const bind_diagram_controller = document_interface => {
    this.add_bind(this.diagram_controller.bind, this.diagram_controller.unbind, document_interface);
    this.add_bind(this.diagram_controller.on_scroll.subscribe, this.diagram_controller.on_scroll.unsubscribe, this.scope_controller.update_drag);
  }

  const bind_document_interface_controller = document_interface => {
    this.add_bind(this.document_interface_controller.bind, this.document_interface_controller.unbind, document_interface);
  }

  const bind = document_interface => {
    this.add_bind(document_interface.on_load.subscribe, document_interface.on_load.unsubscribe, () => bind_document_interface_controller(document_interface));
    this.add_bind(document_interface.on_load.subscribe, document_interface.on_load.unsubscribe, () => bind_diagram_controller(document_interface));
    this.add_bind(document_interface.on_load.subscribe, document_interface.on_load.unsubscribe, () => bind_scope_controller(document_interface));

    const f = () => {
      console.log(this);
    }
    this.add_bind(() => document_interface.on_load_scope.subscribe(f), document_interface.on_load_scope.unsubscribe(f));

  }

  // ---------------------------------------------------------------------------

  this.bind = bind;

  

}